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
		                    <span class="label">Direction:</span>
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
			})

	},
	methods:{
		chartValuationData(){
			const Entry = {
	      		data: '',
	      		valuation: ''
	      	};

			this.companyData.increases.forEach( (increase) => {
				if( increase.virkParity ){
					if( increase.virkIncrease.length == 1 ){
						var valuation = increase.virkIncrease[0].valuation;
					}else{
						var valuation = Math.max(...increase.virkIncrease.map(o => o.valuation));
					}
					this.chartDataValuation.push(
						{
							'x': increase.validFrom, // Named x for x-axis value for chartJS
							'y': valuation 			 // Named y for y-axis value for chartJS

						}
					);
					
					this.ChartDataIvestmentsLabels.push(increase.validFrom);
				}
			})

			var virkIncreaseArraay = [];

			this.companyData.increases.forEach( (increase) => {
				if( increase.virkParity ){
					virkIncreaseArraay.push( increase.virkIncrease );
				}
			})

			/*
			const distinctTypes = Array.from( new Set(increase.virkIncrease.map(o => o.typeIncrease)));	

			
			const dataPerType = distinctTypes.map( d => increase.virkIncrease.filter( o => o.investment == d ));



			const numberOfDatasets = Math.max.apply(null, distinctTypes.map( data => increase.virkIncrease.length));


			for (let i = 0; i < numberOfDatasets; i++) {
				console.log(i);
			  this.chartDataInvestments.push({
			    data: dataPerType.map(data => i < increase.virkIncrease.length ? increase.virkIncrease[i].off : 0),
			    ranges: dataPerType.map(data => i < increase.virkIncrease.length ? increase.virkIncrease[i].range : ''),
			    backgroundColor: distinctTypes.map(d => 
			      "rgba(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ", 0.5)"),
			    categoryPercentage: 1,
			    barPercentage: 1
			  }); 
			}
			*/
			console.log(virkIncreaseArraay);
			

			this.chartReady = true;
		}
	}
}