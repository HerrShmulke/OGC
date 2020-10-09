<template>
	<v-container>
		<v-row>
			<v-col>
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
								<br />
								<v-data-table :headers="dataHeaders" :items="dataItems">
									<template #top>
										<v-toolbar flat>
											<v-spacer></v-spacer>
											<v-btn color="primary" small depressed>Загрузить</v-btn>
										</v-toolbar>
									</template>
								</v-data-table>
							</v-tab-item>
							<v-tab-item>
								<v-data-table :headers="dataHeaders" :items="dataItems" />
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
			dataItems: [
				{ number: 1, date: '21.10.2020', theme: 'Условные операторы' },
			],
		}),

		methods: {
			handleClick(row) {
				console.log(row);
			},
		},
	};
</script>
