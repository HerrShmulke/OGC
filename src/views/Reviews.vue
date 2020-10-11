<template>
  <v-container>
    <v-row>
      <!-- Modal -->
      <v-dialog v-model="dialog" transition="scale-transition" max-width="800" persistent>
        <v-card>
          <v-card-text>
            <v-container>
              <v-row justify="center" align="center">
                <template v-for="(criterion, index) of dialogCriteria">
                  <v-col cols="6" :key="index">
                    <span>
                      {{ criterion.text }}
                    </span>
                  </v-col>
                  <v-col cols="1" :key="index + '_col2'">
                    <v-checkbox v-model="criterion.check" />
                  </v-col>
                  <v-col cols="5" :key="index + '_col3'">
                    <v-text-field label="Пояснение" v-model="criterion.explanation" :disabled="criterion.check" />
                  </v-col>
                </template>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn outlined color="primary" @click="dialog = !dialog">
              Отменить
            </v-btn>
            <v-btn color="primary">
              Сохранить
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- End modal -->
      <!-- Check Review -->
      <v-dialog v-model="checkDialog" transition="scale-transition" max-width="800">
        <v-card>
          <v-card-title>
            Рецензия на вашу работу
          </v-card-title>
          <v-card-text>
            <v-data-table :headers="reviewDialogHeaders" :items="reviewDialogItems" />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" outlined>Подтвердить</v-btn>
            <v-btn color="primary">Оспорить</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- End check Review -->
      <v-col md="12" lg="12" xl="8">
        <v-card outlined>
          <v-card-title>
            Рецензии
          </v-card-title>
          <v-card-text>
            <v-tabs v-model="tab">
              <v-tab>
                Ваши рецензии
              </v-tab>
              <v-tab>
                Рецензии на вас
              </v-tab>
            </v-tabs>
            <v-tabs-items v-model="tab">
              <v-tab-item>
                <v-data-table :headers="reviewHeaders" :items="listOfReviews">
                  <template #item.actions="{ item }">
                    <v-icon @click="download(item)" class="mr-2">
                      mdi-cloud-download-outline
                    </v-icon>
                    <v-icon @click="showDialog(item)" class="mr-2">
                      mdi-book-open-outline
                    </v-icon>
                    <v-scroll-x-transition>
                      <v-icon v-if="item.sent" color="success">
                        mdi-check
                      </v-icon>
                    </v-scroll-x-transition>
                  </template>
                </v-data-table>
              </v-tab-item>
              <v-tab-item>
                <v-data-table :headers="reviewOfYouHeaders" :items="reviewsOfYou" @click:row="checkReview" />
              </v-tab-item>
            </v-tabs-items>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    data: () => ({
      tab: undefined,
      dialog: false,
      checkDialog: false,

      // Список рецензий отправленных пользователем
      listOfReviews: [
        { number: 1, begin: '21.10.2020', end: '26.10.2020', status: 'Принято', sent: true },
        { number: 2, begin: '21.10.2020', end: '26.10.2020', status: 'Ожидает отправления', sent: false },
      ],
      reviewHeaders: [
        { text: 'Номер', value: 'number' },
        { text: 'Дата загрузки', value: 'begin' },
        { text: 'Контрольная дата', value: 'end' },
        { text: 'Статус', value: 'status' },
        { text: 'Действия', value: 'actions', sortable: false },
      ],

      // Список рецензий отправленных пользователю
      reviewsOfYou: [{ number: 1, begin: '18.10.2020', end: '26.10.2020', status: 'Ожидает проверки' }],
      reviewOfYouHeaders: [
        { text: 'Номер', value: 'number' },
        { text: 'Дата начала', value: 'begin' },
        { text: 'Контрольная дата', value: 'end' },
        { text: 'Статус', value: 'status' },
      ],

      // Проверка полученной рецензии
      reviewDialogHeaders: [
        { text: 'Критерии оценки', value: 'evaluation' },
        { text: 'Оценка', value: 'assessment' },
        { text: 'Пояснение', value: 'explanation' },
      ],
      reviewDialogItems: [
        { evaluation: 'Задача оформлена по Стандарту письменных работ студентов', assessment: true, explanation: '' },
        { evaluation: 'Блок-схема соответствует ГОСТу', assessment: false, explanation: 'Foo bar' },
      ],

      dialogCriteria: [
        {
          text: 'Задача оформлена по Стандарту письменных работ студентов',
          check: false,
          explanation: 'Ты гей проста',
        },
        { text: 'Блок-схема соответствует ГОСТу', check: true, explanation: '' },
      ],
    }),

    methods: {
      showDialog(item) {
        this.dialog = true;
      },

      download(item) {
        this.listOfReviews[1].sent = true;
      },

      checkReview(row) {
        this.checkDialog = true;
      },
    },
  };
</script>
