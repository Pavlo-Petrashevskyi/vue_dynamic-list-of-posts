<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    nameText: {
      type: String,
      required: true,
    },
    isNameTextError: Boolean,
    title: {
      type: String,
      default() {
        return 'Title'
      }
    },
    placeholder: {
      type: String,
      default() {
        return 'Post Title'
      }
    }
  },
  emits: ['change-state'],
})
</script>

<template>
  <div class="field" data-cy="NameField">
    <label class="label" htmlFor="{`comment-author-name-${name}`}"> {{ title }} </label>
    <div class="control has-icons-left has-icons-right">
      <input
        type="text"
        name="{name}"
        id="{`comment-author-name-${name}`}"
        :placeholder="placeholder"
        :value="nameText"
        @input="$emit('change-state', ($event.target as HTMLInputElement).value, 'name')"
        class="input"
        :class="{ 'is-danger': !nameText && isNameTextError}"
      />
      <span class="icon is-small is-left">
        <i class="fas fa-user"></i>
      </span>
  
      <span v-show="!nameText && isNameTextError" class="icon is-small is-right has-text-danger" data-cy="ErrorIcon">
        <i class="fas fa-exclamation-triangle"></i>
      </span>
    </div>
  
    <p v-show="!nameText && isNameTextError" class="help is-danger" data-cy="ErrorMessage">Title is required</p>
  </div>
</template>