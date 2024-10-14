<script lang="ts">
import type { Post } from '../../types/Post';
import { defineComponent, type PropType } from 'vue';
import PostLoader from '../loader/PostLoader.vue';
import { getPostsById } from '../../api/api';
import type { User } from '../../types/User';


export default defineComponent({
  components: {
    PostLoader,
  },
  props: {
    isAdding: Boolean,
    posts: Array as PropType<Post[] | null>,
    chosenPost: Object as PropType<Post | null>,
    user: Object as PropType<User | null>
  },
  data() {
    return {
      isLoading: false,
      isPostError: '',
    }
  },
  emits: ['update:isAdding', 'update:chosenPost', 'update:posts', 'change-is-updating'],
  mounted() {
    if (this.user?.id) {
        this.isLoading = true;
        this.isPostError = '';

        getPostsById(this.user?.id)
          .then(({ data }) => {
            this.$emit('update:posts', data);
          })
          .catch(() => {
            this.isPostError = 'Unable to load posts. Please reload page or try again later.'
          })
          .finally(() => this.isLoading = false);
      }
  },
  methods: {
    openingAndClosingChosenPost(currPost: Post) {
      console.log(this.chosenPost?.id === currPost.id ? null : currPost)
      this.$emit('update:chosenPost', this.chosenPost?.id === currPost.id ? null : currPost);
      this.$emit('update:isAdding');
      this.$emit('change-is-updating');
    },
    closeUpdateOpenAdd() {
      this.$emit('update:isAdding', true);
      this.$emit('change-is-updating');
    }
  }
})
</script>

<template>
  <div class="tile is-parent">
    <div class="tile is-child box is-success">
      <div class="block">
        <div class="block is-flex is-justify-content-space-between">
          <h2 class="title">Posts</h2>
          <button 
            type="button" 
            class="button is-link"
            :class="{ 'is-light': isAdding }"
            @click="closeUpdateOpenAdd">Add New Post</button>
        </div>

        <table 
          class="table is-fullwidth is-striped is-hoverable is-narrow"
          v-if="posts && posts.length > 0 && !isLoading && !isPostError" 
        >
          <thead>
            <tr class="has-background-link-light">
              <th>ID</th>
              <th>Title</th>
              <th class="has-text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="post in posts" :key="post.id">
              <td>{{ post.id }}</td>
              <td>{{ post.title }}</td>
              <td class="has-text-right is-vcentered">
                <button 
                  type="button"
                  class="button is-link"
                  :class="{ 'is-light': chosenPost?.id !== post.id }"
                  @click="openingAndClosingChosenPost(post)"
                >
                  {{ chosenPost?.id === post.id ? 'Close' : 'Open'}}
                </button>
              </td>
            </tr>
          </tbody>
        </table> 

        <PostLoader v-if="isLoading && !isPostError" />

        <h3 class="mt-2 has-text-centered" v-show="posts?.length === 0 && !isLoading && !isPostError">
          No posts yet.
        </h3>

        <p 
          v-show="isPostError" 
          class="help is-danger is-size-4 has-text-centered"
        >
          {{ isPostError }}
        </p>
      </div>
    </div>
  </div>
</template>
