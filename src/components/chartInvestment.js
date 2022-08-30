export default {
	template: `
		<canvas id="chart-investment" width="1000" height="300"></canvas>
	`,
	props: [
		'chartDataInvestments',
		'companyData',
		'ChartDataIvestmentsLabels'
	]
	,
	mounted(){

		const ctx = document.getElementById('chart-investment').getContext('2d');
		const myChart = new Chart(ctx, {
		    type: 'bar',
		    data: {
				datasets: [{
					label: 'Investments',
					data: this.chartDataInvestments,
					backgroundColor: [
					  'rgba(255, 99, 132, 0.2)',
					],
					borderColor: [
					  'rgb(255, 99, 132)',
					],
					borderWidth: 3
				}]
		    },
		    options: {
		    	plugins: {
				  datalabels: {
			        display: context => context.dataset.data[context.dataIndex] > 0,
			        formatter: (value, context) => value + ' (' + context.dataset.ranges[context.dataIndex] + ')'
					}
				},
		        scales: {
		        	x: {
				        stacked: true,
				    },
		            y: {
		            	stacked: true,
		                beginAtZero: true,
		            },
		        }
		    }
		});
	}
}