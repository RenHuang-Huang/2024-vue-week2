<script setup>
import { computed, ref } from 'vue'
import Menu from '@/components/Menu.vue'
import Cart from '@/components/Cart.vue'
import Order from '@/components/Order.vue'
const items = ref([
  {
    id: 1,
    name: '珍珠奶茶',
    description: '香濃奶茶搭配QQ珍珠',
    price: 50
  },
  {
    id: 2,
    name: '冬瓜檸檬',
    description: '清新冬瓜配上新鮮檸檬',
    price: 45
  },
  {
    id: 3,
    name: '翡翠檸檬',
    description: '綠茶與檸檬的完美結合',
    price: 55
  },
  {
    id: 4,
    name: '四季春茶',
    description: '香醇四季春茶，回甘無比',
    price: 45
  },
  {
    id: 5,
    name: '阿薩姆奶茶',
    description: '阿薩姆紅茶搭配香醇鮮奶',
    price: 50
  },
  {
    id: 6,
    name: '檸檬冰茶',
    description: '檸檬與冰茶的清新組合',
    price: 45
  },
  {
    id: 7,
    name: '芒果綠茶',
    description: '芒果與綠茶的獨特風味',
    price: 55
  },
  {
    id: 8,
    name: '抹茶拿鐵',
    description: '抹茶與鮮奶的絕配',
    price: 60
  }
])
const carts = ref([])
const handleAddToCart = (item) => {
  if (carts.value.some((cartItem) => cartItem.id === item.id)) {
    return alert('已經加入購物車')
  }
  carts.value.push({
    ...item,
    quantity: 1
  })
  console.log('購物車:', carts)
}

const handleUpdateQuantity = (target, updatevalue) => {
  console.log('變更項:', target)
  carts.value.forEach((cartItem) => {
    if (cartItem.id === target.id) {
      cartItem.quantity = updatevalue
    }
  })
}

const handleDeleteItem = (item) => {
  console.log('刪除項:', item)
  const index = carts.value.findIndex((cartItem) => cartItem.id === item.id)
  carts.value.splice(index, 1)
  console.log('購物車:', carts)
}
const note = ref('')
const order = ref([])
const submit = () => {
  order.value = JSON.parse(JSON.stringify(carts.value))
  order.value.note = note.value
  console.log('購物車:', carts.value)
  console.log('訂單:', order.value)
}
</script>

<template>
  <div id="root">
    <div class="container mt-5">
      <div class="row">
        <!-- 菜單 -->
        <div class="col-md-4">
          <div class="list-group" v-for="item in items" v-bind:key="item.id">
            <Menu
              v-bind:id="item.id"
              v-bind:name="item.name"
              v-bind:price="item.price"
              v-bind:description="item.description"
              v-on:add-to-cart="handleAddToCart(item)" />
          </div>
        </div>

        <!-- 點餐清單 -->
        <div class="col-md-8">
          <table class="table">
            <thead>
              <tr>
                <th scope="col" width="50">操作</th>
                <th scope="col">品項</th>
                <th scope="col">描述</th>
                <th scope="col" width="90">數量</th>
                <th scope="col">單價</th>
                <th scope="col">小計</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in carts" v-bind:key="item.id">
                <Cart
                  v-bind:id="item.id"
                  v-bind:name="item.name"
                  v-bind:description="item.description"
                  v-bind:price="item.price"
                  v-bind:quantity="item.quantity"
                  v-on:update-quantity="handleUpdateQuantity"
                  v-on:delete-item="handleDeleteItem" />
              </tr>
            </tbody>
          </table>
          <div class="text-end mb-3">
            <h5>
              總計:
              <span>{{
                computed(() => {
                  return carts.reduce((acc, item) => acc + item.price * item.quantity, 0)
                })
              }}</span>
            </h5>
          </div>
          <textarea class="form-control mb-3" rows="3" placeholder="備註" v-model="note"></textarea>
          <div class="text-end">
            <button class="btn btn-primary" v-on:click="submit()">送出</button>
          </div>
        </div>
      </div>
      <hr />
      <!-- 訂單 -->

      <div class="row justify-content-center">
        <div class="col-8">
          <div class="card">
            <div class="card-body">
              <template v-if="order.length === 0">
                <div class="card-title">
                  <h5>訂單</h5>
                  <p>尚未點餐</p>
                </div>
              </template>
              <template v-else>
                <div class="card-title">
                  <h5>訂單</h5>
                  <table class="table">
                    <thead>
                      <tr>
                        <th scope="col">品項</th>
                        <th scope="col">數量</th>
                        <th scope="col">小計</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in order" v-bind:key="item.id">
                        <Order
                          v-bind:name="item.name"
                          v-bind:quantity="item.quantity"
                          v-bind:price="item.price" />
                      </tr>
                    </tbody>
                  </table>
                  <div class="text-end">
                    備註: <span>{{ order.note }}</span>
                  </div>
                  <div class="text-end">
                    <h5>
                      總計:
                      <span>
                        ${{
                          computed(() => {
                            return order === undefined
                              ? ''
                              : order.reduce((acc, item) => acc + item.price * item.quantity, 0)
                          })
                        }}
                      </span>
                    </h5>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
