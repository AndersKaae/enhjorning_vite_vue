export default{
	template: `
		<div v-if="loaded == false" class="loading-screen">Loading</div>
		<section class="container investments">
			<div class="investment" v-for="feedItem in feedFiltered">
			    <header class="investment-header">
			        <h2 class="investment__company__name">
			        	<router-link :to="'/company/' + feedItem.cvr">{{ feedItem.name }}</router-link>
			        </h2>
			        <div class="investment_date">
			        	{{ feedItem.increases[feedItem.increases.length - 1].validFrom }}
				    </div>
			    </header>
			    <div class="investment__content" v-for="increase in feedItem.increases[feedItem.increases.length - 1].virkIncrease">
					<div class="investment__investment">
						<h3 class="investment-box-title">Investment</h3>
						<span class="investment__currency">DKK</span>
						<span class="investment__no">{{ Number(increase.investment).toLocaleString() }}</span>
					<div class="investment__type">{{ increase.typeIncrease }}</div>
					</div>
						<div class="investment__ownership">
						<h3 class="investment-box-title">Share</h3>
						<span class="investment__ownership__no">{{  Number( increase.investment / increase.valuation * 100 ).toLocaleString() }}   </span><span class="share-per">%</span>
					</div>
					<div class="investment__valuation">
						<h3 class="investment-box-title">Valuation</h3>
						<span class="investment__currency">DKK</span>
						<span class="investment__valuation_no">{{ Number(increase.valuation).toLocaleString() }}</span>
					</div>
			    </div>
			</div>
		</section>
	`,
	data(){
	    return{
	      	feed: [],
	      	loaded: false,
	      	feedFiltered: []
	    }
  	},
	mounted() {
	    axios
	      .get('http://enhjorning.ddns.net:8000/api/v1/enhjorning/feed?page=1&filtered=true')
	      .then((response) => {
	      	this.feed = response.data
	      	this.loaded = true
	      	this.filteredFeed()
	    })
	},
	methods: {
		filteredFeed: function () {
			var items = this.feed
			var results = [];
      		items.feed.forEach( feedItem => {
				if ( feedItem.increases[feedItem.increases.length - 1].virkParity ) {
					 results.push(feedItem);
				}
			});
			this.feedFiltered = results;
		}
	}
}