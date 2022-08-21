export default {
	template: `
		<canvas id="chart-valuation" width="1000" height="300"></canvas>
	`,
	props: [
		'chartDataValuation'
	],
	mounted(){

		const ctx = document.getElementById('chart-valuation').getContext('2d');
		const myChart = new Chart(ctx, {
		    type: 'line',
		    data: {
		        datasets: [{
		            data: this.chartDataValuation,
		            fill: true,
		            borderColor: 'rgba(255, 159, 64, 1)',
		            backgroundColor: 'rgba(255, 159, 64, 0.2)',
		            tension: 0.1,
		            label: 'Valuation'
		            
		        }]
		    },
		    options: {
		    	legend: {
			      display: false
			    },
		        scales: {
		            y: {
		                beginAtZero: true
		            }
		        },
		    }
		});
	}
}