<script lang="ts">
import { createUser, getUserByEmail } from '../../api/api';
import { defineComponent, type PropType } from 'vue';
import type { User } from '../../types/User';
import NeedToRegister from '../inputs/NeedToRegister.vue';

export default defineComponent({
  components: {
    NeedToRegister,
  },
  props: {
    user: {
      type: Object as PropType<User | null>,
      required: true, 
    },
  },
  emits: ['update:user'],
  data() {
    return {
      start: true,
      email: '',
      name: '',
      isLoading: false,
      isErrorMessage: '',
    }
  },
  methods: {
    handleSubmit() {
      this.isLoading = true;
      this.isErrorMessage = '';

      if (this.start) {
        getUserByEmail(this.email)
          .then(({ data }) => {
            if (data[0]) {
              this.$emit('update:user', data[0]);
              localStorage.setItem('user', JSON.stringify(data[0]));
            }

            this.start = false;
          })
          .catch(() => this.isErrorMessage = 'Unable to get user. Please try again later.')
          .finally(() => this.isLoading = false);
      }

      if (!this.start) {
        createUser(this.email, this.name)
          .then(({ data }) => {
            this.$emit('update:user', data);
            localStorage.setItem('user', JSON.stringify(data));
          })
          .catch(() => this.isErrorMessage = 'Unable to create a user. Please try again later.')
          .finally(() => this.isLoading = false)
      }
    },
  }
})
</script>

<template>
  <section class="container is-flex is-justify-content-center">
    <form @submit.prevent="handleSubmit" class="box mt-5"> 
      <h1 v-show="start" class="title is-3">Get your userId</h1>
      <h1 v-show="!start && !user" class="title is-3">You need to register</h1>

      <div class="field">
        <label class="label" htmlFor="user-email"> Email </label>

        <div class="control has-icons-left">
          <input
            type="email"
            id="user-email"
            name="email"
            class="input"
            placeholder="Enter your email"
            v-model="email"
            :disabled="!start && !user"
            required
          />

          <span class="icon is-small is-left">
            <i class="fas fa-envelope" />
          </span>
        </div>
      </div>

      <NeedToRegister 
        v-if="!start && !user" 
        v-model:name="name"
      />

      <p v-show="isErrorMessage" class="help is-danger mb-4">{{ isErrorMessage }}</p>

      <div class="field">
        <button 
          type="submit" 
          class="button is-primary"
          :class="{ 'is-loading': isLoading, }"
        >
          Login
        </button>
      </div>
    </form>
  </section>
</template>
