<template>
  <v-container>
    <!-- Modal -->
    <v-dialog v-model="uploadDialog" max-width="600" persistent>
      <v-card>
        <v-card-title class="mb-4">Загрузить решение</v-card-title>
        <v-card-text>
          <v-form v-model="valid" ref="form">
            <v-file-input
              show-size
              accept="application/pdf"
              v-model="file"
              :rules="rules"
              dense
              outlined
              class="mr-2"
              placeholder="Не более 3мб"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" text @click="uploadDialog = false">Отменить</v-btn>
          <v-btn color="primary" @click="upload()" :loading="fileLoading" :disabled="fileLoading" append="mdi-upload"
            >Загрузить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- End modal -->

    <v-row>
      <v-col>
        <v-card outlined>
          <v-card-title>Обучение</v-card-title>
          <v-card-text>
            <v-alert dense type="warning">После загрузки изменить файл нельзя!</v-alert>

            <!-- Таблица с списком работ -->
            <v-data-table :headers="tableHeaders" :items="laboratoryList">
              <template v-slot:[`item.upload`]="{ item }">
                <!-- Иконки статуса -->
                <v-icon v-if="item.workDone" color="success">
                  mdi-check
                </v-icon>
                <v-icon v-else-if="!item.workDone && !isRelevant(item.begin_date, item.end_date)" color="error">
                  mdi-window-close
                </v-icon>
                <v-icon
                  v-else
                  color="warning"
                  @click="
                    uploadDialog = true;
                    uploadTopicId = item.id;
                  "
                >
                  mdi-alarm
                </v-icon>
                <!-- End icons -->
              </template>
            </v-data-table>
            <!-- End table -->
          </v-card-text>
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

      uploadDialog: false,
      uploadTopicId: undefined,

      tableHeaders: [
        { text: 'Номер', value: 'id' },
        { text: 'Тема', value: 'name' },
        { text: 'Дата начала', value: 'beginDate' },
        { text: 'Дата окончания', value: 'endDate' },
        { text: 'Решение', value: 'upload', sortable: false },
      ],

      laboratoryList: [],
    }),

    methods: {
      upload() {
        this.$refs.form.validate();
        if (!this.valid) return;

        this.fileLoading = true;

        const formData = new FormData();
        formData.append('topicId', this.uploadTopicId);
        formData.append('file', this.file);

        axios
          .post('api/labs/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          .then((res) => {
            for (let i = 0; i < this.laboratoryList.length; ++i)
              if (this.uploadTopicId === laboratoryList[i].id) laboratoryList[i].workDone = true;
          })
          .catch((err) => {
            /** @todo Реализовать ошибку */
          });

        this.file = undefined;
        this.fileLoading = false;
        this.uploadDialog = false;
      },

      isRelevant(begin, end) {
        const now = Date.now();
        begin = new Date(begin);
        end = new Date(end);

        return now > begin && now < end;
      },

      async loadTopicList() {
        /** @type {Object[]} */
        let list = (await axios.post('/api/labs/list')).data.response;

        list = list.map((e) => {
          const endDate = new Date(e.end_date);
          const beginDate = new Date(e.begin_date);

          e.endDate = `${endDate.getFullYear()}-${endDate.getMonth() + 1}-${endDate.getDate()}`;
          e.beginDate = `${beginDate.getFullYear()}-${beginDate.getMonth() + 1}-${beginDate.getDate()}`;

          return e;
        });

        this.laboratoryList = list.reverse();
      },
    },

    mounted() {
      this.loadTopicList();
    },
  };
</script>
