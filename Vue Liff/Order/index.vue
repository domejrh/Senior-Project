<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-6">Food Ordering</h1>
      </v-col>
    </v-row>

    <!-- ส่วนการจองเวลา -->
    <v-row class="mb-6">
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title class="text-h6">
            จองเวลา
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="6">
                <v-menu
                  ref="dateMenu"
                  v-model="dateMenu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="reservationDate"
                      label="วันที่"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="reservationDate"
                    :min="minDate"
                    @input="dateMenu = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" sm="6">
                <v-menu
                  ref="timeMenu"
                  v-model="timeMenu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="reservationTime"
                      label="เวลา"
                      prepend-icon="mdi-clock-outline"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-time-picker
                    v-model="reservationTime"
                    :allowed-hours="allowedHours"
                    format="24hr"
                    @input="timeMenu = false"
                  ></v-time-picker>
                </v-menu>
              </v-col>
            </v-row>
            <v-text-field
              v-model="numberOfGuests"
              type="number"
              label="จำนวนคน"
              min="1"
              max="10"
              prepend-icon="mdi-account-group"
            ></v-text-field>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- ส่วนค้นหาเมนู -->
    <v-row class="mb-4">
      <v-col cols="12">
        <v-text-field
          v-model="searchTerm"
          label="ค้นหาเมนู"
          prepend-icon="mdi-magnify"
          outlined
          clearable
        ></v-text-field>
      </v-col>
    </v-row>

    <!-- ส่วนแท็บหมวดหมู่อาหาร -->
    <v-tabs
      v-model="activeTab"
      centered
      grow
    >
      <v-tab
        v-for="category in categories"
        :key="category"
      >
        <v-icon left>{{ getCategoryIcon(category) }}</v-icon>
        {{ category }}
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="activeTab">
      <v-tab-item
        v-for="category in categories"
        :key="category"
      >
        <v-row>
          <v-col 
            v-for="(item, index) in filteredMenuItems(category)"
            :key="index"
            cols="12" 
            sm="6" 
            md="4"
          >
            <v-card
              class="mx-auto"
              height="100%"
              elevation="2"
              hover
            >
              <v-img
                :src="item.image"
                height="200"
                cover
                :alt="item.name"
              >
                <template v-slot:placeholder>
                  <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                  >
                    <v-progress-circular
                      indeterminate
                      color="grey lighten-5"
                    ></v-progress-circular>
                  </v-row>
                </template>
              </v-img>
              <v-card-title class="text-h6 text-truncate">
                {{ item.name }}
              </v-card-title>
              <v-card-text>
                <div style="height: 48px; overflow: hidden;">
                  {{ item.description }}
                </div>
                <v-row align="center" class="mt-4">
                  <v-col cols="6">
                    <div class="text-h6 primary--text">฿{{ formatPrice(item.price) }}</div>
                  </v-col>
                  <v-col cols="6">
                    <div class="d-flex align-center justify-end">
                      <v-btn
                        icon
                        @click="decreaseQuantity(item)"
                        :disabled="item.quantity <= 0"
                        color="primary"
                      >
                        <v-icon>mdi-minus</v-icon>
                      </v-btn>
                      <span class="mx-3 text-h6">{{ item.quantity }}</span>
                      <v-btn
                        icon
                        @click="increaseQuantity(item)"
                        color="primary"
                      >
                        <v-icon>mdi-plus</v-icon>
                      </v-btn>
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-tab-item>
    </v-tabs-items>

    <!-- สรุปออเดอร์ -->
    <v-row class="mt-6" v-if="selectedItems.length > 0">
      <v-col cols="12" md="8" offset-md="2">
        <v-card elevation="3">
          <v-card-title class="text-h5">
            <v-icon left color="primary">mdi-cart</v-icon>
            สรุปรายการอาหาร
          </v-card-title>
          <v-card-text>
            <!-- ข้อมูลการจอง -->
            <v-card outlined class="mb-4">
              <v-card-text>
                <div class="text-h6 mb-2">
                  <v-icon left color="primary">mdi-information</v-icon>
                  ข้อมูลการจอง
                </div>
                <v-list-item dense>
                  <v-list-item-icon>
                    <v-icon>mdi-calendar</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>วันที่: {{ formattedReservationDate }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item dense>
                  <v-list-item-icon>
                    <v-icon>mdi-clock-outline</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>เวลา: {{ reservationTime }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item dense>
                  <v-list-item-icon>
                    <v-icon>mdi-account-group</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>จำนวนคน: {{ numberOfGuests }} คน</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-card-text>
            </v-card>

            <v-list>
              <v-list-item v-for="item in selectedItems" :key="item.name">
                <v-list-item-avatar
                  tile
                  size="60"
                >
                  <v-img :src="item.image" />
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title class="text-h6">
                    {{ item.name }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ item.quantity }} x ฿{{ formatPrice(item.price) }} = ฿{{ formatPrice(item.quantity * item.price) }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <v-divider class="my-4"></v-divider>
            <div class="text-right text-h5">
              รวมทั้งสิ้น: ฿{{ formatPrice(totalPrice) }}
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn 
              color="primary" 
              x-large 
              @click="submitOrder"
              :disabled="!isValidReservation"
              min-width="150"
            >
              <v-icon left>mdi-check</v-icon>
              สั่งอาหาร
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Dialog แจ้งเตือนการจองสำเร็จ -->
    <v-dialog
      v-model="successDialog"
      max-width="400"
      persistent
    >
      <v-card>
        <v-card-title class="text-h5 px-6 pt-6">
          <v-icon
            left
            color="success"
            size="32"
            class="mr-2"
          >
            mdi-check-circle
          </v-icon>
          จองสำเร็จ
        </v-card-title>
        
        <v-card-text class="px-6 pt-4">
          <v-row no-gutters>
            <v-col cols="12" class="mb-3">
              <div class="subtitle-1">
                <v-icon small left class="mr-2" color="primary">mdi-calendar</v-icon>
                วันที่: {{ formattedReservationDate }}
              </div>
            </v-col>
            <v-col cols="12" class="mb-3">
              <div class="subtitle-1">
                <v-icon small left class="mr-2" color="primary">mdi-clock-outline</v-icon>
                เวลา: {{ reservationTime }}
              </div>
            </v-col>
            <v-col cols="12" class="mb-3">
              <div class="subtitle-1">
                <v-icon small left class="mr-2" color="primary">mdi-account-group</v-icon>
                จำนวนคน: {{ numberOfGuests }} คน
              </div>
            </v-col>
            <v-col cols="12">
              <div class="subtitle-1">
                <v-icon small left class="mr-2" color="primary">mdi-cash</v-icon>
                ยอดรวม: ฿{{ formatPrice(totalPrice) }}
              </div>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="px-6 pb-4">
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            @click="closeSuccessDialog"
            min-width="120"
          >
            ตกลง
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog แจ้งเตือนข้อผิดพลาด -->
    <v-dialog
      v-model="errorDialog"
      max-width="400"
    >
      <v-card>
        <v-card-title class="text-h5 px-6 pt-6">
          <v-icon
            left
            color="error"
            size="32"
            class="mr-2"
          >
            mdi-alert-circle
          </v-icon>
          แจ้งเตือน
        </v-card-title>
        
        <v-card-text class="px-6 pt-4">
          {{ errorMessage }}
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="px-6 pb-4">
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            @click="errorDialog = false"
            min-width="120"
          >
            ตกลง
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script>
export default {
  name: 'FoodOrder',
  data() {
    return {
      searchTerm: '',
      dateMenu: false,
      timeMenu: false,
      reservationDate: new Date().toISOString().substr(0, 10),
      reservationTime: null,
      numberOfGuests: 1,
      activeTab: 0,
      successDialog: false,
      errorDialog: false,
      errorMessage: '',
      categories: ['All', 'Appetizers', 'Main Courses', 'Seafood'],
      menuItems: [
        {
          name: 'Papaya Salad',
          price: 200,
          image: require('~/assets/Menu1.jpg'),
          quantity: 0,
          category: 'Appetizers',
          description: 'Traditional Thai spicy green papaya salad with fresh vegetables'
        },
        {
          name: 'Lobster Taco',
          price: 380,
          image: require('~/assets/Menu3.jpg'),
          quantity: 0,
          category: 'Seafood',
          description: 'Soft shell tacos filled with fresh lobster meat'
        },
        {
          name: 'Lobster Sandwich',
          price: 450,
          image: require('~/assets/Menu4.jpg'),
          quantity: 0,
          category: 'Seafood',
          description: 'Toasted brioche filled with succulent lobster meat'
        },
        {
          name: 'Salmon Cream Cheese',
          price: 280,
          image: require('~/assets/Menu5.jpg'),
          quantity: 0,
          category: 'Seafood',
          description: 'Smoked salmon served with cream cheese on artisanal bread'
        },
        {
          name: 'Seared Scallop',
          price: 950,
          image: require('~/assets/Menu6.jpg'),
          quantity: 0,
          category: 'Seafood',
          description: 'Perfectly seared scallops with seasonal accompaniments'
        },
        {
          name: 'Beef Wellington',
          price: 2500,
          image: require('~/assets/Menu7.jpg'),
          quantity: 0,
          category: 'Main Courses',
          description: 'Premium beef tenderloin wrapped in puff pastry'
        },
        {
          name: 'Lobster Risotto',
          price: 1000,
          image: require('~/assets/Menu8.jpg'),
          quantity: 0,
          category: 'Main Courses',
          description: 'Creamy Italian risotto with fresh lobster meat'
        },
        {
          name: 'Focaccia',
          price: 180,
          image: require('~/assets/Menu9.jpg'),
          quantity: 0,
          category: 'Appetizers',
          description: 'Traditional Italian flatbread with herbs and olive oil'
        },
        {
          name: 'Italian Pizza',
          price: 450,
          image: require('~/assets/Menu12.jpg'),
          quantity: 0,
          category: 'Main Courses',
          description: 'Authentic Italian pizza with premium toppings'
        }
      ]
    }
  },
  computed: {
    selectedItems() {
      return this.menuItems.filter(item => item.quantity > 0)
    },
    totalPrice() {
      return this.selectedItems.reduce((total, item) => {
        return total + (item.price * item.quantity)
      }, 0)
    },
    minDate() {
      return new Date().toISOString().substr(0, 10)
    },
    isValidReservation() {
      return this.reservationDate && 
             this.reservationTime && 
             this.numberOfGuests > 0 && 
             this.numberOfGuests <= 10 &&
             this.selectedItems.length > 0
    },
    formattedReservationDate() {
      if (!this.reservationDate) return ''
      const [year, month, day] = this.reservationDate.split('-')
      return `${day}/${month}/${year}`
    }
  },
  methods: {
    increaseQuantity(item) {
      item.quantity++
    },
    decreaseQuantity(item) {
      if (item.quantity > 0) {
        item.quantity--
      }
    },
    formatPrice(price) {
      return price.toLocaleString()
    },
    submitOrder() {
      if (!this.isValidReservation) {
        this.errorMessage = 'กรุณากรอกข้อมูลการจองให้ครบถ้วน'
        this.errorDialog = true
        return
      }
      this.successDialog = true
    },
    closeSuccessDialog() {
      this.successDialog = false
      this.resetOrder()
    },
    resetOrder() {
      this.menuItems.forEach(item => item.quantity = 0)
      this.reservationTime = null
      this.numberOfGuests = 1
      this.reservationDate = new Date().toISOString().substr(0, 10)
      this.searchTerm = ''
      this.activeTab = 0
    },
    allowedHours: v => v >= 11 && v <= 21,
    getCategoryIcon(category) {
      const icons = {
        'All': 'mdi-food-variant',
        'Appetizers': 'mdi-food',
        'Main Courses': 'mdi-silverware-fork-knife',
        'Seafood': 'mdi-fish'
      }
      return icons[category] || 'mdi-food'
    },
    filteredMenuItems(category) {
      return this.menuItems.filter(item => {
        const matchesSearch = 
          item.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(this.searchTerm.toLowerCase())
        
        if (category === 'All') {
          return matchesSearch
        }
        
        return matchesSearch && item.category === category
      })
    }
  }
}
</script>