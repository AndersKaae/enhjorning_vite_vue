import ChartValuation from "./chartValuation.js";
import ChartInvestment from "./chartInvestment.js";

export default{
	template: `
		<div v-if="loaded == false" class="loading-screen">Loading</div>
		<header class="page-header page-header--company">
		      <div class="container">
		          <h1 class="page-title">{{ companyData.name }}</h1>
		          <div class="company-meta">
		              <ul>
		                <li class="company-cvr">
		                    <span class="label">CVR-no:</span>
		                    <span><a :href="'https://datacvr.virk.dk/enhed/virksomhed/' +  companyData.cvr" target="_blank" title="Besøg på virk.dk">{{ companyData.cvr }}</a></span>
		                </li>
		                <li class="company-area">
		                    <span class="label">Industry:</span>
		                    <span>{{ companyData.businessCode }}</span>
		                </li>
		                <li class="company-website">
		                    <span class="label">Website:</span>
		                    <span>
		                      <a :href="'https://' + companyData.website" title="See more on virk.dk" target="_blank" class="company-website">{{ companyData.website}}</a>
		                    </span>
		                </li>
		              </ul>
		              
		              <ul>
		                <li>
		                    <span class="label">CEOs:</span>
		                    <span>
		                      <span v-for="ceoMember in companyData.ceo">
		                        {{ ceoMember.role }}: {{ ceoMember.name }} <br />
		                      </span>
		                    </span>
		                </li>
		              </ul>
		          </div>
		      </div>
		  </header>
		  
		  <section class="container" v-if="chartReady">
		    <chart-valuation :chartDataValuation="chartDataValuation"></chart-valuation>
		  </section>

		   <section class="container" v-if="chartReady">
		    <chart-investment 
		    	:chartDataInvestments="chartDataInvestments"
		    	:companyData="companyData"
		    	:ChartDataIvestmentsLabels="ChartDataIvestmentsLabels"
		    ></chart-investment>
		  </section>
		  
		  <section class="container company-people">
		    <div class="company-owners">
		    <h2>Owners</h2>
		    <ul class="current-owners">
		      <li v-for="ownerMember in companyData.owner" class="current-owner">
		        <span>{{ ownerMember.name }}</span>
		        <span class="company-owner__share">{{ ownerMember.values[0].ownerPercentage*100 }}%</span>
		      </li>
		    </ul>
		    </div>
		    
		    <div class="company-boardmembers">
		      <h2>Boardmembers</h2>
		      <ul>
		        <li v-for="boardMember in companyData.board">
		          <span>{{ boardMember.name }}</span>
		          <span v-if="boardMember.role != 'BESTYRELSESMEDLEM'"> ({{ boardMember.role }})</span>
		        </li>
		      </ul>
		    </div>
		  </section>
	`,
	components: {
		'chart-valuation' : ChartValuation,
		'chart-investment' : ChartInvestment
	},
	data(){
	    return{
	      	companyData: [],
	      	loaded: false,
	      	chartDataValuation: [],
	      	chartDataInvestments: [],
	      	chartReady: false,
	      	ChartDataIvestmentsLabels: []
	    }
  	},
	mounted() {
	    axios
			.get('http://enhjorning.ddns.net:8000/api/v1/enhjorning/company?cvr='+this.$route.params.cvr)
			.then((response) => {
				this.companyData = response.data
				this.loaded= true
				this.chartValuationData()
				this.chartInvestmentData()
			})

	},
	methods:{
		chartValuationData(){
			const Entry = {
	      		data: '',
	      		valuation: ''
	      	};

			let counter = 0;
			this.companyData.increases.forEach( (increase) => {
				if (counter == 0){
					this.chartDataValuation.push(
						{
							'x': increase.validFrom, // Named x for x-axis value for chartJS
							'y': increase.capital 			 // Named y for y-axis value for chartJS

						}
					)
				}else if (increase.type == "increased" ){
					this.chartDataValuation.push(
						{
							'x': increase.validFrom, // Named x for x-axis value for chartJS
							'y': increase.valuation 			 // Named y for y-axis value for chartJS

						}
					);
					this.ChartDataIvestmentsLabels.push(increase.validFrom);
				}
				counter +=1;
			})
		},
		
		chartInvestmentData(){
			let counter = 0;
			this.companyData.increases.forEach( (increase) => {
				if (counter == 0){
					this.chartDataInvestments.push( 						{
						'x': increase.validFrom, // Named x for x-axis value for chartJS
						'y': increase.capital 			 // Named y for y-axis value for chartJS

					} );
				}else if (increase.type == "increased" ){
				this.chartDataInvestments.push( 						{
					'x': increase.validFrom, // Named x for x-axis value for chartJS
					'y': increase.investment // Named y for y-axis value for chartJS

				});
				}
			counter +=1;
			})
			this.chartReady = true;
		}
	
	}
}