<script lang="ts">
import { deletePost } from '../../api/api';
import type { Post } from '../../types/Post';
import { defineComponent, type PropType } from 'vue';

export default defineComponent({
  props: {
    chosenPost: {
      type: Object as PropType<Post>,
      required: true,
    }
  },
  data() {
    return {
      isErrorMessage: '',
    }
  },
  emits: ['changing-is-update', 'filtering-posts', 'update:chosen-post', 'changing-is-adding'],
  methods: {
    removePost(postToRemoveId: number) {
      this.isErrorMessage = '';

      deletePost(postToRemoveId)
        .then(() => {
          this.$emit('filtering-posts', postToRemoveId);
          this.$emit('update:chosen-post', null);
          this.$emit('changing-is-update', false);
        })
        .catch(() => {
          this.isErrorMessage = 'Unable to delete a post. Please try again later.'
        });
    },
    openUpdatePost() {
      this.$emit('changing-is-update', true);
      this.$emit('changing-is-adding', false);
    }
  }
})
</script>

<template>
  <div class="block">
    <div class="is-flex is-justify-content-space-between is-align-items-center">
      <h2>#{{ chosenPost.id }}: {{ chosenPost.title }}</h2>
      <div class="is-flex">
        <span 
          class="icon is-small is-right is-clickable"
          @click="$emit('changing-is-update', true)"
        >
          <i class="fas fa-pen-to-square"></i>
        </span>

        <span 
          class="icon is-small is-right has-text-danger is-clickable ml-3"
          @click="removePost(chosenPost.id)"
        >
          <i class="fas fa-trash"></i>
        </span>
      </div>
    </div>
    <p data-cy="PostBody">{{ chosenPost.body }}</p>

    <p 
      v-show="isErrorMessage" 
      class="help is-danger is-size-5 has-text-centered" 
    >
      {{ isErrorMessage }}
    </p>
  </div>
</template>