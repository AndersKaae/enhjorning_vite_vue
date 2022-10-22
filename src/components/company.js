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
						<li class="company-founded">
							<span class="label">Founded:</span>
							<span>{{ founded }}</span>
						</li>
		                <li class="company-area">
		                    <span class="label">Industry:</span>
		                    <span>{{ companyData.businessCode }}</span>
		                </li>
		                <li class="company-website" v-if="companyData.website">
		                    <span class="label">Website:</span>
		                    <span>
		                      <a :href="'https://' + companyData.website" title="See more on virk.dk" target="_blank" class="company-website">{{ companyData.website}}</a>
		                    </span>
		                </li>
		              </ul>
		              
		              <ul>
		                <li>
		                    <span class="label">C-suite:</span>
		                    <span>
		                      <span v-for="ceoMember in companyData.ceo">
							  	<span v-if="ceoMember.validTo == 'None'">
		                        	{{ ceoMember.role }}: {{ ceoMember.name }} <br />
								</span>
		                      </span>
		                    </span>
		                </li>
		              </ul>
		          </div>
		      </div>
		  </header>
		  
		  <section class="container container--graph" v-if="chartReady">
		    <chart-valuation :chartDataValuation="chartDataValuation"></chart-valuation>
		  </section>

		   <section class="container container--graph" v-if="chartReady">
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
			      <span v-for="ownerMember in companyData.owner">
				  	<span v-if="ownerMember.values[ownerMember.values.length - 1].validTo == 'None'">
			        	<li class="current-owner">
						<span>{{ ownerMember.name }}</span>
			        	<span class="company-owner__share">{{ ownerMember.values[ownerMember.values.length - 1].ownerPercentage*100 }}%</span>
						</li>
					<span>
			      </span>
			    </ul>
		    </div>
		    
			<div class="company-boardmembers" v-if="boardMembers.length > 0">
				<h2>Boardmembers</h2>
				<ul>
					<li v-for="boardMember in boardMembers">
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
	      	ChartDataIvestmentsLabels: [],
			boardMembers: [],
			ceoMembers: [],
			founded: ''
	    }
  	},
	mounted() {
	    axios
			.get('https://enhjorningbotapi-production.up.railway.app/api/v1/enhjorning/company?cvr='+this.$route.params.cvr, {auth: {username: 'enhjorningbot@gmail.com',password: 'bf7f8df76a4443f2ae6de295f5fd3340'}})
			.then((response) => {
				this.companyData = response.data
				this.loaded= true
				this.chartValuationData()
				this.chartInvestmentData()
				this.activeBoardMembers()
				this.activeCeoMembers()
				this.companyFoundedDate()
			});
	},
	methods:{

		companyFoundedDate() {
			this.founded = this.companyData.increases[0].validFrom;
		},

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
		},
		activeBoardMembers(){
			this.companyData.board.forEach( (member) => {
				if (member.validTo == 'None'){
					this.boardMembers.push(member)
				}
			});
		},
		activeCeoMembers(){
			this.companyData.ceo.forEach( (member) => {
				if (member.validTo == 'None'){
					this.ceoMembers.push(member)
				}
			});
		}
	
	}
}