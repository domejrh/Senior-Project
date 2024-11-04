<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 text-center mb-6">Our Menu</h1>
      </v-col>
    </v-row>

    <v-row class="mb-6">
      <v-col cols="12">
        <v-text-field
          v-model="searchTerm"
          label="Search menu"
          prepend-icon="mdi-magnify"
          outlined
          clearable
        ></v-text-field>
      </v-col>
    </v-row>

    <v-tabs
      v-model="activeTab"
      centered
      grow
    >
      <v-tab
        v-for="category in categories"
        :key="category"
      >
        {{ category }}
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="activeTab">
      <v-tab-item
        v-for="category in categories"
        :key="category"
      >
        <v-row class="mt-4">
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
            >
              <v-img
                :src="item.image"
                height="200"
                cover
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

              <v-card-title class="text-h5">
                {{ item.name }}
              </v-card-title>

              <v-card-text>
                <div class="mb-4">{{ item.description }}</div>
                <div class="text-h6 primary--text">฿{{ formatPrice(item.price) }}</div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
export default {
  name: 'MenuDisplay',
  data() {
    return {
      searchTerm: '',
      activeTab: 0,
      categories: ['All', 'Appetizers', 'Main Courses', 'Seafood'],
      menuItems: [
        { 
          name: 'Papaya Salad',
          price: 200,
          image: require('~/assets/Menu1.jpg'),
          description: 'Traditional Thai spicy green papaya salad with fresh vegetables',
          category: 'Appetizers'
        },
        { 
          name: 'Lobster Taco',
          price: 380,
          image: require('~/assets/Menu3.jpg'),
          description: 'Soft shell tacos filled with fresh lobster meat',
          category: 'Seafood'
        },
        { 
          name: 'Lobster Sandwich',
          price: 450,
          image: require('~/assets/Menu4.jpg'),
          description: 'Toasted brioche filled with succulent lobster meat',
          category: 'Seafood'
        },
        { 
          name: 'Salmon Cream Cheese',
          price: 280,
          image: require('~/assets/Menu5.jpg'),
          description: 'Smoked salmon served with cream cheese on artisanal bread',
          category: 'Seafood'
        },
        { 
          name: 'Seared Scallop',
          price: 950,
          image: require('~/assets/Menu6.jpg'),
          description: 'Perfectly seared scallops with seasonal accompaniments',
          category: 'Seafood'
        },
        { 
          name: 'Beef Wellington',
          price: 2500,
          image: require('~/assets/Menu7.jpg'),
          description: 'Premium beef tenderloin wrapped in puff pastry',
          category: 'Main Courses'
        },
        { 
          name: 'Lobster Risotto',
          price: 1000,
          image: require('~/assets/Menu8.jpg'),
          description: 'Creamy Italian risotto with fresh lobster meat',
          category: 'Main Courses'
        },
        { 
          name: 'Focaccia',
          price: 180,
          image: require('~/assets/Menu9.jpg'),
          description: 'Traditional Italian flatbread with herbs and olive oil',
          category: 'Appetizers'
        },
        { 
          name: 'Italian Pizza',
          price: 450,
          image: require('~/assets/Menu12.jpg'),
          description: 'Authentic Italian pizza with premium toppings',
          category: 'Main Courses'
        },
      ]
    }
  },
  methods: {
    formatPrice(price) {
      return price.toLocaleString()
    },
    filteredMenuItems(category) {
      return this.menuItems.filter(item => {
        const matchesSearch = 
          item.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(this.searchTerm.toLowerCase());
        
        if (category === 'All') {
          return matchesSearch;
        }
        
        return matchesSearch && item.category === category;
      });
    }
  }
}
</script>