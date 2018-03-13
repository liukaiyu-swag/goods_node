var list = Vue.component('list', {
	template: `
		<div>
			<h1 class="title">{{datas.name}}</h1>
			<img :src="'img/'+datas.src"/>
			<div class="text">
					<span class="price"><em style="font-size: 30px;margin-right: 2px;">{{datas.price}}</em>¥</span>
					<i class="carIco" @click="add(datas.id)">+</i>
			</div>
		</div>
	`,
	methods: {
		add(id) {
			fetch('/add/'+id).then(function(e) {
				return e.text();
			}).then(function(e) {
				if(e == "ok") {
					alert("选购成功!");
				}
			});
		}
	},
	props: ["datas"]
});
var car = Vue.component("car", {
	template: `
		<div>
					<table class="table table-bordered">
						<caption>购物车</caption>
						<tbody>
							<tr>
								<th>编号</th>
								<th>名称</th>
								<th>单价</th>
								<th>数量</th>
								<th>价格</th>
								<th>操作</th>
							<tr>
							<tr v-if="goods.length==0">
								<td colspan="6">没有商品</td>
							</tr>
							<tr v-for="(item,index) in goods">
								<td v-text="item.cid"></td>
								<td v-text="item.name"></td>
								<td v-text="item.price"></td>
								<td style="width: 250px;">
									<div class="form-group" style="width: 200px;margin: auto;">
										<button class="btn btn-default" @click="del(item)">-</button>
										<input type="text" class="form-control" placeholder="Search" v-model="item.num" style="width: 100px;display: inline-block;" @keyup="check(item)">
										<button class="btn btn-default" @click="add(item)">+</button>
									</div>
								</td>
								<td v-text="item.num*item.price"></td>
								<td>
									<button type="button" class="btn btn-danger" @click="sc(item.cid)">删除</button>
								</td>
							</tr>
							<tr>
								<td>总数量</td>
								<td v-text="nums" colspan="2"></td>
								<td>总价格</td>
								<td v-text="prices" colspan="2"></td>
							</tr>
						</tbody>
					</table>	
				</div>
	`,
	data() {
		return {
			goods: []
		};
	},
	methods: {
		sc(id) {
			fetch("/del", {
				method: "post",
				body: "id=" + id,
				headers: {
					"content-type": "application/x-www-form-urlencoded"
				}
			}).then((e) => {
				return e.text();
			}).then((e) => {
				if(e == "ok") {
					this.goods = this.goods.filter((val) => {
						if(val.cid != id) {
							return val.id;
						}
					});
				}
			});
		},
		add(item) {
			fetch("/update/" + item.cid + "/" + (item.num + 1)).then(function(e) {
				return e.text();
			}).then(function(e) {
				if(e == "ok") {
					item.num++;
				}
			});
		},
		del(item) {
			if(item.num == 1) {
				return;
			}
			fetch("/update/" + item.cid + "/" + (item.num - 1)).then(function(e) {
				return e.text();
			}).then(function(e) {
				if(e == "ok") {
					item.num--;
				}
			});
		},
		check(item) {
			var num = 0;
			if(!parseFloat(item.num) && item.num) {
				num = 1;
			} else {
				num = parseFloat(item.num) || "";
			}
			fetch("/update/" + item.cid + "/" + num).then(function(e) {
				return e.text();
			}).then(function(e) {
				if(e == "ok") {
					item.num = num;
				}
			});
		}
	},
	computed: {
		nums() {
			var sum = 0;
			this.goods.forEach(function(val) {
				sum += parseFloat(val["num"] || 0);
			});
			return sum;
		},
		prices() {
			var sum = 0;
			this.goods.forEach(function(val) {
				sum += parseFloat(val["num"] * val["price"]);
			});
			return sum;
		}
	},
	mounted() {
		var obj = new XMLHttpRequest();
		obj.open("GET", "/find");
		obj.send();
		obj.onload = function() {
			var data = JSON.parse(obj.response);
			this.goods = data;
		}.bind(this)
	}
});var index=Vue.component("index",{
	template:`
		<ul class="xz">
			<li v-for="item in datas">
				<list :datas="item"></list>
			</li>
		</ul>
	`,
	data(){
		return {
			datas:[]
		};
	},
	mounted(){
		fetch('/selectGoods').then(function(e){
			return e.json();
		}).then(function(e){
			this.datas=e;
		}.bind(this));
	}
});