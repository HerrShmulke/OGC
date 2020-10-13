<template>
  <div>
    <v-bottom-navigation v-if="$vuetify.breakpoint.mobile" app color="primary">
      <v-btn to="/school">
        <span>Обучение</span>
        <v-icon>mdi-school-outline</v-icon>
      </v-btn>

      <v-btn to="/reviews">
        <span>Рецензии</span>
        <v-icon>mdi-file-outline</v-icon>
      </v-btn>
    </v-bottom-navigation>
    <v-navigation-drawer mini-variant app v-else>
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

    mounted() {},
  };
</script>
