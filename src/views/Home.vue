<template>
  <div>
    <v-navigation-drawer mini-variant app>
      <v-list dense>
        <MenuItem to="/school" icon="mdi-school-outline" name="Обучение" />
        <MenuItem to="/reviews" icon="mdi-file-outline" name="Рецензии" />
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
  };
</script>
