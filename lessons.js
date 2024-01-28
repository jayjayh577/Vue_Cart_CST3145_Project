 let courseStore = new Vue ({
    el: "#app",
    data: {
        sitename: "LessonStore",
        checkoutinfo: "Check Out Info",
        show: true,
        defaultSort: "null",
        sortDirection: "asc", 
        searchQuery:"", 
        lessons: [],
        checkoutInfo: {
          Name: "",
          Number: "",
        },
        NameValid: "",
        NumberValid: "",
        isLoading: false,
        carts: [],
        searchCriteria: 'subject',
    },
    methods: {
      fetchDataFromAPI: function() {
        this.isLoading = true;

        fetch('https://cartsystem-env.eba-pybmsf3v.eu-north-1.elasticbeanstalk.com/collections/Products')
          .then(response => response.json())
          .then(data => {
            this.lessons = data;
          })
          .catch(error => {
            console.error('Error fetching data from API:', error);
          })
          .finally(() => {
            this.isLoading = false;
          });
      },

        addToCart: function(lesson){
            if (this.canAddToCart(lesson)) {
                if(lesson.AddedTOCart > 0){
                  lesson.AddedTOCart++;
                }else {
                  lesson.AddedTOCart++;
                  this.carts.push(lesson);
                }
              
                lesson.available--;
                
                 console.log(this.carts);
              }
        },
        canAddToCart: function(lesson){
            return lesson.available > 0;
        },
        removeFromCart(lesson) {

          const index = this.carts.indexOf(lesson);

          if (index !== -1) {
            if (lesson.AddedTOCart > 1) {
              // Decrease the AddedTOCart count
              lesson.AddedTOCart--;
            } else {
              // Remove the lesson from the cart if AddedTOCart is 1
              lesson.AddedTOCart--;
              this.carts.splice(index, 1);
            }
              lesson.available++;

              console.log(this.carts);
              // lesson.AddedTOCart--;
          }
        },
        checkout() {
          // Check if there are items in the cart
          if (this.carts.length === 0) {
            alert('Your cart is empty. Add items before checking out.');
            return;
          }
        
          // Create an array to store the items in the cart
          const cartItems = this.carts.map((item) => {
            return {
              lesson_id: item.id,  // Adjust this based on the structure of your lesson objects
              addedToCart: item.AddedTOCart,
              // Add other properties as needed
            };
          });
        

          const postData = {
            name: this.NameValid,
            phoneNumber: this.NumberValid,
            cartItems: cartItems,
          };
        
          // Send a POST request to the server
          fetch('https://cartsystem-env.eba-pybmsf3v.eu-north-1.elasticbeanstalk.com/collections/Order', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData),
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              return response.json();
            })
            .then((json) => {
              alert(`Congratulations ${this.NameValid}! Your order has been placed.`);
              console.log('Success:', json);
              
              // Clear the cart after successful checkout
              this.carts = [];
            })
            .catch((error) => {
              console.error('Error during checkout:', error);
            });
        }
        
    },
    computed: {
        ItemsInCart: function () {
            return this.carts.length;
        },

        DisplayLessons() {
          // Sort all lessons
          const sortOrder = this.sortDirection === "asc" ? 1 : -1;
          return this.lessons.slice().sort((a, b) => {
            if (this.defaultSort === "subject") {
              return sortOrder * a.subject.localeCompare(b.subject);
            } else if (this.defaultSort === "location") {
              return sortOrder * a.location.localeCompare(b.location);
            } else if (this.defaultSort === "price") {
              const priceA = parseFloat(a.price);
              const priceB = parseFloat(b.price);
              return sortOrder * (priceA - priceB);
            } else if (this.defaultSort === "available") {
              return sortOrder * (a.available - b.available);
            }
          });
        },
        
        searchLessons() {
          const query = this.searchQuery.toLowerCase().trim();
          const criteria = this.searchCriteria;
        
          // Check if the search query is empty
          if (query === '') {
            // Reset this.lessons with the original data (or handle it based on your needs)
            this.fetchDataFromAPI();
            return;
          }
        
          // Use the selected criteria in the API endpoint
          const apiEndpoint = `https://cartsystem-env.eba-pybmsf3v.eu-north-1.elasticbeanstalk.com/collections/Products/search?${criteria}=${query}`;
        
          // Fetch lessons based on the selected criteria
          fetch(apiEndpoint)
            .then(response => response.json())
            .then(data => {
              this.lessons = data;
            })
            .catch(error => {
              console.error(`Error fetching data from search API (${criteria}):`, error);
            });
        },

         
        sortedCarts() {
            return this.carts.slice().sort((a, b) => {
              // Compare lessons based on the selected criteria
              const sortOrder = this.sortDirection === "asc" ? 1 : -1;

              if (this.defaultSort === "subject") {
                return sortOrder * a.subject.localeCompare(b.subject);
              } else if (this.defaultSort === "location") {
                return sortOrder *  a.location.localeCompare(b.location);
              } else if (this.defaultSort === "price") {
                const priceA = parseFloat(a.price.replace('$', ''));
                const priceB = parseFloat(b.price.replace('$', ''));
                return sortOrder * (priceA - priceB);
              } else if (this.defaultSort === "available") {
                return sortOrder *  a.available - b.available;
              }
            });
          },
          isNameandNumberValid() {
            const namePattern = /^[a-zA-Z ]+$/;
            const phoneNumberTest =
              /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
            return (
              namePattern.test(this.NameValid) &&
              phoneNumberTest.test(this.NumberValid)
            );
          }
    },

     mounted() {
    // Fetch data when the component is mounted
    this.fetchDataFromAPI();
  },
});