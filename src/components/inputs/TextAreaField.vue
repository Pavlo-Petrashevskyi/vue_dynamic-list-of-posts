<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    bodyText: String,
    isBodyTextError: Boolean,
    title: {
      type: String,
      default() {
        return 'Write Post Body';
      }
    },
    placeholder: {
      type: String,
      default() {
        return 'Post body';
      }
    }
  },
  emits: ['change-state'],
})
</script>

<template>
  <div class="field" data-cy="BodyField">
    <label class="label" htmlFor="{`comment-${name}`}"> {{ title }} </label>
    <div class="control">
      <textarea
        id="{`comment-${name}`}"
        name="name"
        :placeholder="placeholder"
        :value="bodyText"
        @input="$emit('change-state', ($event.target as HTMLTextAreaElement).value, 'body')"
        class="textarea"
        :class="{'is-danger': isBodyTextError}"

      ></textarea>
    </div>
  
    <p v-show="isBodyTextError" class="help is-danger" data-cy="ErrorMessage">Body is required</p>
  </div>
</template>