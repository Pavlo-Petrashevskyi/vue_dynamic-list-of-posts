<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import InputField from '../inputs/InputField.vue';
import TextAreaField from '../inputs/TextAreaField.vue';
import { createPost, updatePost } from '../../api/api';
import type { Post } from '../../types/Post';

export default defineComponent({
  components: {
    InputField,
    TextAreaField,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    userId: Number,
    isAdding: Boolean,
    isUpdating: Boolean,
    chosenPost: Object as PropType<Post | null>,
  },
  emits: [
    'update:is-adding',
    'update:is-updating',
    'adding-new-post',
    'update:chosen-post',
    'change-old-posts-to-updated',
    'change-is-writing-comment'
  ],
  data() {
    return {
      nameText: '',
      bodyText: '',
      isNameTextError: false,
      isBodyTextError: false,
      isErrorMessage: '',
    }
  },
  mounted() {
    this.nameText = this.chosenPost?.title || '';
    this.bodyText = this.chosenPost?.body || '';
    this.$emit('change-is-writing-comment');
    
    if (this.isAdding && !this.isUpdating) {
      this.$emit('update:chosen-post', null);
    }
  },
  methods: {
    changeState(value: string, identificator: string) {
      this.isNameTextError = false;
      this.isBodyTextError = false;

      if (identificator === 'name') {
        return this.nameText = value.trim() || '';
      }

      if (identificator === 'body') {
        return this.bodyText = value.trim() || '';
      }
    },
    handleSubmit() {
      this.isErrorMessage = '';

      if (!this.bodyText) {
        this.isBodyTextError = true;
      }

      if (!this.nameText) {
        this.isNameTextError = true;
      }

      if (this.bodyText && this.nameText && this.userId && this.isAdding) {
        return createPost(this.nameText, this.bodyText, this.userId)
          .then(({ data }) => {
            this.$emit('adding-new-post', data)
            this.$emit('update:chosen-post', data);
            this.$emit('update:is-adding', false);
            this.bodyText = '';
            this.nameText = '';
          })
          .catch(() => {
            this.isErrorMessage = 'Unable to create a post. Please try again later.'
          })
      }

      console.log(this.bodyText, this.nameText, this.userId, this.isUpdating, this.chosenPost);

      if (this.bodyText && this.nameText && this.userId
        && this.isUpdating && this.chosenPost) {
        return updatePost(this.nameText, this.bodyText, this.chosenPost.id, this.userId)
          .then(({ data }) => {
            this.$emit('change-old-posts-to-updated', data);
            this.$emit('update:chosen-post', data);
            this.$emit('update:is-updating', false);
            this.bodyText = '';
            this.nameText = '';
          })
          .catch(() => {
            this.isErrorMessage = 'Unable to update a post. Please try again later.'
          })
      }
    },
    clearAddAndUpdateForm() {
      this.isErrorMessage = '';
      this.bodyText = '';
      this.nameText = '';
      this.$emit('update:is-adding', false);
      this.$emit('update:is-updating', false);
    }
  }
})
</script>

<template>
  <div className="content">
    <h2>{{ title }}</h2>

    <form @submit.prevent="handleSubmit">
      <InputField :name-text="isUpdating ? nameText : ''" @change-state="changeState" :is-name-text-error />
      <TextAreaField :body-text="isUpdating ? bodyText : ''" @change-state="changeState" :is-body-text-error />

      <div className="field is-grouped">
        <div className="control">
          <button type="submit" className="button is-link">Save</button>
        </div>
        <div className="control">
          <button type="reset" className="button is-link is-light" @click="clearAddAndUpdateForm()">
            Cancel
          </button>
        </div>
      </div>

      <p v-show="isErrorMessage" class="help is-danger mt-5 is-size-4 has-text-centered">{{ isErrorMessage }}</p>
    </form>
  </div>
</template>