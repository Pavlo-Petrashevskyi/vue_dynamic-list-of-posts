<script lang="ts">
import { defineComponent } from 'vue';
import LoaderComponent from './LoaderComponent.vue';

export default defineComponent({
  components: {
    LoaderComponent,
  }
})
</script>
<template>
  <div className="is-flex is-justify-content-center is-align-items-center mt-2">
    <LoaderComponent />
  </div> 
</template>