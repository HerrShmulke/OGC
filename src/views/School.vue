<template>
  <v-container>
    <v-row>
      <v-col md="6" lg="6" xl="4">
        <v-card outlined>
          <v-card-title>Обучение</v-card-title>
          <v-card-text>
            <v-alert dense type="info">Принимаются лабораторные работы до 26.10.2020</v-alert>
            <v-alert dense type="warning">После загрузки изменить файл нельзя!</v-alert>
            <v-file-input
              show-size
              outlined
              dense
              label="Загрузить работу"
              prepend-icon="mdi-file-document-outline"
              accept="application/pdf"
            />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary">Загрузить</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
