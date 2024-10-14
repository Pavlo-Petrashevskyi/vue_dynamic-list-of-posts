<script lang="ts">
import { defineComponent } from 'vue';
import InputField from '../inputs/InputField.vue';
import EmailCommentInput from '../inputs/EmailCommentInput.vue';
import TextAreaField from '../inputs/TextAreaField.vue';
import { createComment } from '../../api/api';

export default defineComponent({
  props: ['postId', 'nameText', 'emailText'],
  components: {
    InputField,
    EmailCommentInput,
    TextAreaField,
  },
  emits: [
    'change-is-writing-comment',
    'add-new-comment',
    'change-is-comment-error',
    'update:name-text',
    'update:email-text',
  ],
  data() {
    return {
      bodyText: '',
      isNameTextError: false,
      isEmailTextError: false,
      isBodyTextError: false,
      isLoadingNewComment: false,
    }
  },
  methods: {
    handleSubmit() {
      this.$emit('change-is-comment-error', '');

      if (!this.bodyText) {
        this.isBodyTextError = true;
      }

      if (!this.nameText) {
        this.isNameTextError = true;
      }

      if (!this.emailText) {
        this.isEmailTextError = true;
      }

      if (this.emailText && this.nameText && this.bodyText) {
        this.isLoadingNewComment = true;

        return createComment(this.postId, this.nameText, this.bodyText, this.emailText)
          .then(({ data }) => {
            this.$emit('add-new-comment', data);
            this.$emit('change-is-writing-comment');
            this.bodyText = '';
          })
          .catch(() => this.$emit('change-is-comment-error', 'Unable to add new comment. Please try again later.'))
          .finally(() => {
            this.isLoadingNewComment = false;
          })
      }
    },
    changeState(value: string, identificator: string) {
      this.isNameTextError = false;
      this.isEmailTextError = false;
      this.isBodyTextError = false;

      switch (identificator) {
        case 'name':
          return this.$emit('update:name-text', (value.trim() || ''));
        case 'body':
          return this.bodyText = value.trim() || '';
        case 'email':
          return this.$emit('update:email-text', (value.trim() || ''));

        default:
          return;
      }
    },
    cancelCommentCreate() {
      this.$emit('change-is-writing-comment');
      this.$emit('change-is-comment-error', '')
    }
  }
})
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <InputField title="Author name" placeholder="Name Surname" @change-state="changeState" :name-text="nameText"
      :is-name-text-error />
    <EmailCommentInput title="Author email" @change-state="changeState" :email-text="emailText" :is-email-text-error />
    <TextAreaField title="Write Comment Body" placeholder="Comment" @change-state="changeState" :body-text="bodyText"
      :is-body-text-error />

    <div class="field is-grouped">
      <div class="control">
        <button type="submit" class="button is-link" :class="{ 'is-loading': isLoadingNewComment }">
          Add Comment
        </button>
      </div>
      <div class="control">
        <button type="reset" class="button is-link is-light" @click="cancelCommentCreate">
          Cancel
        </button>
      </div>
    </div>
  </form>
</template>