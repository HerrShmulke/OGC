<template>
  <v-container>
    <v-row>
      <v-col md="6" lg="6" xl="4">
        <v-card outlined>
          <v-card-title>
            Рецензии
          </v-card-title>
          <v-card-text>
            <h3>Рецензии на вас</h3>
            <v-data-table :headers="dataHeaders" :items="dataItems" @click:row="handleClick" />
            <h3>Ваши рецензии</h3>
            <v-data-table :headers="dataHeaders" :items="dataItems" @click:row="handleClick" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    data: () => ({
      dataHeaders: [
        {
          text: 'Номер',
          value: 'number',
        },
        {
          text: 'Дата',
          value: 'date',
        },
        { text: 'Тема', value: 'theme' },
      ],
      dataItems: [{ number: 1, date: '21.10.2020', theme: 'Условные операторы' }],
    }),

    methods: {
      handleClick(row) {
        console.log(row);
      },
    },
  };
</script>
