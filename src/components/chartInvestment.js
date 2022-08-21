export default {
	template: `
		<canvas id="chart-investment" width="1000" height="300"></canvas>
		<h2>chartDataInvestments</h2>
		<pre class="container">{{ chartDataInvestments }}</pre>
		<h2>ChartDataIvestmentsLabels</h2>
		<pre class="container">{{ ChartDataIvestmentsLabels }}</pre>
		<div class="container" v-for="ent in companyData.increases">
			<pre>{{ ent.virkIncrease }}</pre>
		</div>
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
		        labels: this.ChartDataIvestmentsLabels,
			    datasets: this.chartDataInvestments
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
		                beginAtZero: true
		            },
		        }
		    }
		});
	}
}