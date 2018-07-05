<template>
<div class="snackbar">
	<div id="snackbar">{{message}}</div>
</div>
</template>

<script>
export default {
	data () {
		return {
			message: ''
		}
	},
	created: function () {

		this.$bus.$on('showSnackbar', (val)=> {
			this.message = val
		    var x = document.getElementById("snackbar")
		    x.className = "show";
		    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);

		    
		    // setTimeout(function(){ x.className = x.className.replace("show", ""); }, 5000);
		})
	},
	methods: {
	}
}
</script>
