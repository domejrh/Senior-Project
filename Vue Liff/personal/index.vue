<template>
  <v-container>
    <!-- Header Section -->
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-6">
          <v-icon large color="primary" class="mr-2">mdi-ticket-percent</v-icon>
          โปรโมชั่นพิเศษ
        </h1>
      </v-col>
    </v-row>

    <!-- Promotions Card -->
    <v-row>
      <v-col cols="12" md="8" offset-md="2">
        <v-card class="elevation-2">
          <v-card-title class="d-flex align-center py-4">
            <div>
              <div class="text-h5 font-weight-bold">
                โปรโมชั่นประจำวัน
              </div>
              <div class="text-subtitle-2 mt-1 grey--text">
                เลือกโปรโมชั่นที่ต้องการและกดรับสิทธิ์ได้ทันที
              </div>
            </div>
            <v-spacer></v-spacer>
            <v-chip color="primary" class="px-3">
              <v-icon left small>mdi-calendar</v-icon>
              {{ currentDate }}
            </v-chip>
          </v-card-title>

          <v-divider></v-divider>

          <!-- Promotions List -->
          <v-list>
            <v-list-item
              v-for="(promo, index) in promotions"
              :key="index"
              class="promotion-item"
            >
              <v-list-item-avatar
                size="56"
                class="mr-4"
                color="grey lighten-4"
              >
                <v-icon large :color="promo.iconColor">{{ promo.icon }}</v-icon>
              </v-list-item-avatar>
              
              <v-list-item-content>
                <v-list-item-title class="text-h6 mb-1 font-weight-bold">
                  {{ promo.title }}
                </v-list-item-title>
                <v-list-item-subtitle class="mb-3 text-subtitle-1">
                  {{ promo.description }}
                </v-list-item-subtitle>
                
                <v-row align="center">
                  <v-col cols="12" sm="6">
                    <v-chip
                      :color="getCountdownColor(promo.timeRemaining)"
                      text-color="white"
                      class="px-3"
                    >
                      <v-icon left small>mdi-clock-outline</v-icon>
                      {{ formatTimeRemaining(promo.timeRemaining) }}
                    </v-chip>
                  </v-col>
                  <v-col cols="12" sm="6" class="text-sm-right">
                    <v-btn
                      color="primary"
                      outlined
                      @click="claimPromotion(promo)"
                      :loading="loadingStates[index]"
                      :disabled="promo.timeRemaining <= 0"
                      class="px-6"
                    >
                      <v-icon left>mdi-ticket-percent</v-icon>
                      รับสิทธิ์
                    </v-btn>
                  </v-col>
                </v-row>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>

        <!-- Order Button Card -->
        <v-card class="mt-4 pa-4 text-center elevation-1" outlined>
          <v-btn
            color="success"
            x-large
            block
            @click="goToOrderPage"
            :href="orderPageUrl"
            height="56"
            class="font-weight-bold"
          >
            <v-icon left>mdi-silverware</v-icon>
            ไปที่หน้าสั่งอาหาร
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

    <!-- Success Dialog -->
    <v-dialog v-model="dialog" max-width="400">
      <v-card>
        <v-card-title class="text-h5 pa-6">
          <v-icon large left color="success" class="mr-2">
            mdi-check-circle
          </v-icon>
          รับสิทธิ์สำเร็จ!
        </v-card-title>
        
        <v-card-text class="pa-6">
          <v-row align="center" class="mb-4">
            <v-col cols="auto">
              <v-avatar size="48" color="grey lighten-4">
                <v-icon large :color="selectedPromotion.iconColor">
                  {{ selectedPromotion.icon }}
                </v-icon>
              </v-avatar>
            </v-col>
            <v-col>
              <div class="text-subtitle-1 mb-1">คุณได้รับสิทธิ์</div>
              <div class="text-h6 font-weight-bold">{{ selectedPromotion.title }}</div>
            </v-col>
          </v-row>
          
          <v-alert
            type="success"
            class="mb-4"
            dense
            border="left"
          >
            <div class="font-weight-bold">รหัสโปรโมชัน:</div>
            <div class="text-h6 mt-1">{{ selectedPromotion.code }}</div>
          </v-alert>

          <v-alert
            type="info"
            text
            dense
            class="mb-0"
          >
            <v-icon small left color="info">mdi-information</v-icon>
            กรุณาแคปหน้าจอเก็บไว้เป็นหลักฐาน หรือจดรหัสโปรโมชันเพื่อใช้งาน
          </v-alert>
        </v-card-text>
        
        <v-divider></v-divider>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn
            text
            @click="dialog = false"
            class="mr-2"
          >
            ปิด
          </v-btn>
          <v-btn
            color="primary"
            @click="sharePromotion"
            class="px-6"
          >
            <v-icon left>mdi-share-variant</v-icon>
            แชร์
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: 'PromotionsDaily',
  data() {
    return {
      currentDate: new Date().toLocaleDateString('th-TH', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      dialog: false,
      selectedPromotion: {},
      loadingStates: {},
      orderPageUrl: '/order',
      promotions: [
        {
          title: 'ส่วนลด 50% สำหรับอาหารมื้อกลางวัน',
          description: 'รับส่วนลดพิเศษสำหรับอาหารกลางวันทุกรายการ',
          timeRemaining: 7200, // 2 hours in seconds
          initialTime: 7200,
          code: 'LUNCH50',
          icon: 'mdi-silverware-fork-knife',
          iconColor: 'amber darken-2'
        },
        {
          title: 'ฟรี! เครื่องดื่มเมื่อสั่งอาหาร',
          description: 'รับเครื่องดื่มฟรี 1 แก้วเมื่อสั่งอาหารครบ 500 บาท',
          timeRemaining: 18000, // 5 hours in seconds
          initialTime: 18000,
          code: 'FREEDRINK',
          icon: 'mdi-cup',
          iconColor: 'light-blue darken-1'
        },
        {
          title: 'สะสมแต้ม 2 เท่า',
          description: 'รับแต้มสะสม 2 เท่าสำหรับทุกการสั่งซื้อวันนี้',
          timeRemaining: 28800, // 8 hours in seconds
          initialTime: 28800,
          code: 'DOUBLEPOINT',
          icon: 'mdi-star-circle',
          iconColor: 'deep-purple lighten-1'
        }
      ]
    }
  },
  methods: {
    formatTimeRemaining(seconds) {
      if (seconds <= 0) {
        return 'หมดเวลาแล้ว'
      }
      
      const hours = Math.floor(seconds / 3600)
      const minutes = Math.floor((seconds % 3600) / 60)
      const remainingSeconds = seconds % 60

      if (hours > 0) {
        return `${hours} ชั่วโมง ${minutes} นาที`
      } else if (minutes > 0) {
        return `${minutes} นาที ${remainingSeconds} วินาที`
      } else {
        return `${remainingSeconds} วินาที`
      }
    },
    getCountdownColor(seconds) {
      if (seconds <= 0) return 'grey'
      if (seconds <= 300) return 'red' // Less than 5 minutes
      if (seconds <= 1800) return 'orange' // Less than 30 minutes
      return 'primary'
    },
    async claimPromotion(promo) {
      this.$set(this.loadingStates, this.promotions.indexOf(promo), true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      this.selectedPromotion = promo
      this.dialog = true
      this.$set(this.loadingStates, this.promotions.indexOf(promo), false)
    },
    sharePromotion() {
      alert('กำลังแชร์โปรโมชัน: ' + this.selectedPromotion.title)
    },
    goToOrderPage() {
      console.log('Navigating to order page with promotion:', this.selectedPromotion.code)
    },
    startCountdown() {
      setInterval(() => {
        this.promotions.forEach((promo, index) => {
          if (promo.timeRemaining > 0) {
            promo.timeRemaining--
          } else {
            // Reset countdown when it reaches 0
            promo.timeRemaining = promo.initialTime
          }
        })
      }, 1000)
    }
  },
  mounted() {
    this.startCountdown()
  },
  beforeDestroy() {
    // Clear interval when component is destroyed
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval)
    }
  }
}
</script>

<style scoped>
.promotion-item {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  padding: 24px;
}
.promotion-item:last-child {
  border-bottom: none;
}
</style>