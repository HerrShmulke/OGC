<template>
  <div>
    <v-navigation-drawer mini-variant app>
      <v-list dense>
        <MenuItem to="/school" icon="mdi-school-outline" name="Обучение" />
        <MenuItem to="/reviews" icon="mdi-file-outline" name="Рецензии" />
        <v-divider /> 
        <v-list-item>
          <v-icon @click="changeTheme()">
            mdi-theme-light-dark
          </v-icon>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <router-view />
    </v-main>
  </div>
</template>

<script>
  import MenuItem from '../components/MenuItem.vue';

  export default {
    components: {
      MenuItem,
    },

    methods: {
      changeTheme() {
        this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
        localStorage.setItem('theme', this.$vuetify.theme.dark);
      },
    },
  };
</script>
