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
		    data: this.chartDataInvestments,
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
						ticks: {
                    // Include a dollar sign in the ticks
                    callback: function(value, index, ticks) {
                        return 'DKK ' + value;
                    }}
		            },
		        }
		    }
		});
	}
}