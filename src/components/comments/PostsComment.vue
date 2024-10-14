<script lang="ts">
import { deleteComment } from '../../api/api';
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    email: String,
    name: String,
    body: String,
    id: {
      type: Number,
      required: true,
    },
  },
  emits: ['filtering-comments', 'change-is-comment-error'],
  methods: {
    removeComment() {
      this.$emit('change-is-comment-error', '');

      deleteComment(this.id)
        .then(() => {
          this.$emit('filtering-comments', this.id);
        })
        .catch(() => this.$emit('change-is-comment-error', 'Unable to delete a comment. Please try again later.'));
    }
  }
})
</script>

<template>
  <article className="message is-small">
    <div className="message-header">
      <a :href="`mailto:${email}`"> {{ name }} </a>
      <button 
        type="button" 
        className="delete is-small" 
        aria-label="delete"
        @click="removeComment()"
      >
        delete button
      </button>
    </div>
    <div className="message-body">{{ body }}</div>
  </article>  
</template>