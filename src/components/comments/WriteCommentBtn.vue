<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  emits: ['change-is-writing-comment']
})
</script>

<template>
  <button 
    type="button" 
    className="button is-link"
    @click="$emit('change-is-writing-comment')"
  >
    Write a comment
  </button>
</template>