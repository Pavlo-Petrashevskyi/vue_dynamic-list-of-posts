<script lang="ts">
import { defineComponent } from "vue";
import LoginComponent from "./components/login/LoginComponent.vue";
import PostsHeader from "./components/posts/PostsHeader.vue";
import PostsList from "./components/posts/PostsList.vue";
import SidebarEl from "./components/extra/SidebarEl.vue";
import AddAndUpdatePost from "./components/extra/AddAndUpdatePost.vue";
import PostPreview from './components/posts/PostPreview.vue';
import NoCommentsYet from "./components/comments/NoCommentsYet.vue";
import PostsComment from "./components/comments/PostsComment.vue";
import WriteCommentBtn from "./components/comments/WriteCommentBtn.vue";
import PostLoader from "./components/loader/PostLoader.vue";
import type { User } from "./types/User";
import type { Post } from "./types/Post";
import { getCommentsByPostId } from "./api/api";
import type { Comment } from "./types/Comment";
import NewCommentForm from "./components/comments/NewCommentForm.vue";

type AppState = {
  user: User,
  isAdding: boolean,
  isUpdating: boolean,
  isWritingComment: boolean,
  isLoadingComments: boolean,
  chosenPost: Post | null,
  posts: Post[] | null,
  comments: Comment[],
  isCommentError: string,
  nameText: string,
  emailText: string,
}

export default defineComponent({
  components: {
    LoginComponent,
    PostsHeader,
    PostsList,
    PostPreview,
    SidebarEl,
    AddAndUpdatePost,
    NoCommentsYet,
    PostsComment,
    WriteCommentBtn,
    PostLoader,
    NewCommentForm,
  },
  data(): AppState {
    return {
      user: null,
      isAdding: false,
      isUpdating: false,
      isWritingComment: false,
      isLoadingComments: false,
      chosenPost: null,
      posts: null,
      comments: [],
      isCommentError: '',
      nameText: '',
      emailText: '',
    }
  },
  mounted() {
    this.user = JSON.parse(localStorage.getItem('user') || '') || null;
  },
  watch: {
    chosenPost(newChosenPost: Post | null) {
      this.isCommentError = '';

      if (newChosenPost) {
        this.isLoadingComments = true;

        getCommentsByPostId(newChosenPost.id)
          .then(({ data }) => {
            this.comments = data;
          })
          .catch(() => {
            this.isCommentError = 'Unable to load comments. Please close and open a chosen post or try again later.'
          })
          .finally(() => {
            this.isLoadingComments = false;
          })
      }
    }
  },
  methods: {
    addingNewPost(newPost: Post) {
      this.posts?.push(newPost);
    },
    addingNewComment(newComment: Comment) {
      this.comments.push(newComment);
    },
    changeOldPostToUpdated(newUpdatedPost: Post) {
      this.posts = this.posts
        ?.map((post: Post) => post.id === newUpdatedPost.id ? newUpdatedPost : post) || null;
    },
    filterPosts(filteredPostId: number) {
      this.posts = this.posts?.filter(post => post.id !== filteredPostId) || null;
    },
    filteringComments(commmentId: number) {
      this.comments = this.comments.filter(comment => comment.id !== commmentId);
    },
  }
})
</script>

<template>
  <LoginComponent v-if="!user" v-model:user="user"/>
  <template v-if="user">
    <PostsHeader v-model:user="user"/>

    <main class="section">
      <div class="container">
        <div class="tile is-ancestor">
          <PostsList
            v-model:is-adding="isAdding"
            v-model:chosen-post="chosenPost"
            v-model:posts="posts"
            @change-is-updating="isUpdating = false"
            :user="user"
          />

          <SidebarEl :class="{'Sidebar--open': isAdding || chosenPost || isUpdating}">
            <AddAndUpdatePost
              v-if="isAdding"
              title="Create new post"
              :user-id="user.id"
              v-model:is-adding="isAdding"
              v-model:chosen-post="chosenPost"
              @change-is-writing-comment="isWritingComment = false"
              @adding-new-post="addingNewPost"
            />

            <AddAndUpdatePost
              v-if="isUpdating"
              title="Post editing"
              :user-id="user.id"
              v-model:is-updating="isUpdating"
              v-model:chosen-post="chosenPost"
              @change-old-posts-to-updated="changeOldPostToUpdated"
              @change-is-writing-comment="isWritingComment = false"
            />

            <template v-if="chosenPost && !isAdding && !isUpdating">
              <PostPreview
                v-model:chosen-post="chosenPost"
                @changing-is-update="(newValue: boolean) => isUpdating = newValue"
                @changing-is-adding="(newValue: boolean) => isAdding = newValue"
                @filtering-posts="filterPosts"
              />

              <PostLoader v-if="isLoadingComments"/>

              <NoCommentsYet v-if="comments.length === 0 && !isLoadingComments && !isCommentError" />

              <template v-else-if="comments.length > 0  && !isWritingComment && !isLoadingComments && !isCommentError">
                <PostsComment
                  v-for="comment in comments"
                  :key="comment.id"
                  v-bind="comment"
                  @filtering-comments="filteringComments"
                  @change-is-comment-error="(newValue: string) => isCommentError = newValue"
                />
              </template>

              <WriteCommentBtn
                v-if="!isWritingComment && !isLoadingComments && !isCommentError"
                @change-is-writing-comment="isWritingComment = true"
              />

              <NewCommentForm
                v-if="isWritingComment && !isLoadingComments"
                :post-id="chosenPost.id"
                v-model:name-text="nameText"
                v-model:email-text="emailText"
                @change-is-writing-comment="isWritingComment = false"
                @add-new-comment="addingNewComment"
                @change-is-comment-error="(newValue: string) => isCommentError = newValue"
              />

              <p
                v-show="isCommentError && !isLoadingComments"
                class="help is-danger is-size-5 mt-5 has-text-centered"
              >
                {{ isCommentError }}
              </p>
            </template>
          </SidebarEl>
        </div>
      </div>
    </main>
  </template>
</template>
