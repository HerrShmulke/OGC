<template>
  <v-container>
    <v-row>
      <v-col md="6" lg="6" xl="4">
        <v-card outlined>
          <v-card-title>Обучение</v-card-title>
          <v-card-text>
            <v-alert dense type="info">Принимаются лабораторные работы до 26.10.2020</v-alert>
            <v-alert dense type="warning">После загрузки изменить файл нельзя!</v-alert>
            <v-form v-model="valid" ref="form">
              <v-file-input
                show-size
                outlined
                dense
                :rules="rules"
                label="Загрузить работу"
                prepend-icon="mdi-file-document-outline"
                accept="application/pdf"
                v-model="file"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" @click="upload()" :loading="fileLoading" :disabled="fileLoading">Загрузить</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import axios from 'axios';

  export default {
    data: () => ({
      file: undefined,
      valid: false,
      rules: [(value) => !value || value.size < 0x300000 || 'Размер файла не должен превышать 3мб.'],
      fileLoading: false,
    }),

    methods: {
      upload() {
        this.$refs.form.validate();
        if (!this.valid) return;

        this.fileLoading = true;

        const formData = new FormData();
        formData.append('topicId', 1);
        formData.append('file', this.file);

        axios
          .post('api/labs/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          .then((res) => {
            this.file = undefined;
            this.fileLoading = false;
          })
          .catch((err) => {
            /** @todo Реализовать ошибку */

            this.file = undefined;
            this.fileLoading = false;
          });
      },
    },
  };
</script>
