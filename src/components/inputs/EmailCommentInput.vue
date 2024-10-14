<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    emailText: {
      type: String,
      required: true,
    },
    isEmailTextError: Boolean,
    title: String,
  },
  emits: ['change-state'],
})
</script>

<template>
  <div class="field">
    <label class="label" htmlFor="user-email"> {{ title }} </label>
    <div class="control has-icons-left has-icons-right">
      <input
        type="email"
        id="user-email"
        name="email"
        class="input"
        placeholder="Your Email"
        :value="emailText"
        @input="$emit('change-state', ($event.target as HTMLInputElement).value, 'email')"
        :class="{ 'is-danger': !emailText && isEmailTextError}"
      />

      <span class="icon is-small is-left">
        <i class="fas fa-envelope" />
      </span>

      <span v-show="!emailText && isEmailTextError" class="icon is-small is-right has-text-danger" data-cy="ErrorIcon">
        <i class="fas fa-exclamation-triangle"></i>
      </span>
    </div>

    <p v-show="!emailText && isEmailTextError" class="help is-danger" data-cy="ErrorMessage">Email is required</p>
  </div>
</template>