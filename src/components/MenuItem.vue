<template>
  <v-tooltip right>
    <template #activator="{ on }">
      <v-list-item v-on="on" :to="to" :exact="exact">
        <v-list-item-icon>
          <v-icon>{{ icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content> </v-list-item-content>
      </v-list-item>
    </template>
    <span>{{ name }}</span>
  </v-tooltip>
</template>

<script>
  export default {
    props: {
      to: String,
      icon: String,
      name: String,
      exact: Boolean,
    },
  };
</script>
