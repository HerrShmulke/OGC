<template>
  <v-container class="fill-height" @keyup.enter="login()">
    <!-- Snackbar -->

    <!-- End snackbar -->

    <v-row justify="center" align="center">
      <v-col md="7" lg="6" xl="4">
        <!-- Begin card -->
        <v-card outlined>
          <v-card-title class="primary white--text">
            Авторизация
          </v-card-title>

          <!-- Body -->
          <v-card-text>
            <v-form lazy-validation v-model="valid" ref="form">
              <v-container class="text-center">
                <v-alert type="error" v-show="!!error" dense dismissible transition="scale-transition">
                  {{ error }}
                </v-alert>
                <v-text-field
                  dense
                  outlined
                  label="Name"
                  type="Text"
                  :min="4"
                  hint="Не менее 6 символов"
                  :counter="30"
                  v-model="name"
                  :rules="nameRule"
                  autocomplete="off"
                />
                <v-text-field
                  dense
                  outlined
                  label="Password"
                  hint="Не менее 6 символов"
                  :append-icon="togglePassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="togglePassword ? 'text' : 'password'"
                  :min="6"
                  v-model="password"
                  :rules="passwordRule"
                  @click:append="togglePassword = !togglePassword"
                />
                <v-checkbox label="Запомнить меня" class="mt-0" light hide-details v-model="remember" />
              </v-container>
            </v-form>
          </v-card-text>

          <!-- Actions -->
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" :loading="query" :disabled="query" @click="login()">Продолжить</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { load } from 'recaptcha-v3';
  import axios from 'axios';

  export default {
    data: () => ({
      valid: true,
      remember: false,
      query: false,
      error: '',
      name: '',
      password: '',
      nameRule: [(v) => v.length <= 30 || 'Максимум 30 символов', (v) => v.length >= 6 || 'Минимум 6 символов'],
      passwordRule: [(v) => v.length >= 6 || 'Минимум 6 символов'],
      togglePassword: false,
    }),

    methods: {
      async login() {
        const recaptcha = await load(process.env.VUE_APP_PUBLIC_KEY, {
          autoHideBadge: true,
        });

        let token;

        try {
          token = await recaptcha.execute();
        } catch (err) {
          this.error = 'Recaptcha error';
          return;
        }

        await this.$refs.form.validate();
        if (!this.valid) return;

        this.query = true;

        try {
          const response = await axios.post('/api/login', {
            remember: this.remember,
            pass: this.password,
            name: this.name,
            reToken: token,
          });

          if (response.data.error) {
            this.error = response.data.error.message;
          } else {
            this.$router.push('/');
          }

          this.query = false;
        } catch (err) {
          console.log(err);
          this.error = 'Ошибка сети';
          this.query = false;
        }
      },
    },
  };
</script>
