<template>
  <div>
    <v-navigation-drawer mini-variant app>
      <v-list dense>
        <MenuItem to="/" icon="mdi-account" name="Профиль" />
      </v-list>
    </v-navigation-drawer>
    <v-main></v-main>
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
