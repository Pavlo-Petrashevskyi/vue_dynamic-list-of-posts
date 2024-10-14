<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    name: String,
  },
  emits: ['update:name'],
})
</script>

<template>
  <div class="field">
    <label class="label" htmlFor="user-name"> Your Name </label>

    <div class="control has-icons-left">
      <input
        type="text"
        id="user-name"
        name="name"
        class="input"
        placeholder="Enter your name"
        minlength="{4}"
        required
        :value="name"
        @input="event => $emit('update:name', (event.target as HTMLInputElement).value || '')"
      />

      <span class="icon is-small is-left">
        <i class="fas fa-user" />
      </span>
    </div>

    <p v-show="false" class="help is-danger">error message</p>
  </div>
</template>