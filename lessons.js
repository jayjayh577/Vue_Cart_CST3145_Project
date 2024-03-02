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
      serverURL: "https://cartsystem-env.eba-pybmsf3v.eu-north-1.elasticbeanstalk.com/collections/Products",
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

    addToCart: function (lesson) {
      if (this.canAddToCart(lesson)) {
        if (lesson.AddedTOCart > 0) {
          lesson.AddedTOCart++;
        } else {
          lesson.AddedTOCart++;
          if (!lesson._id) {
            console.error('Lesson ID is missing. Please check your lesson object.');
            return;
          }
          this.carts.push(lesson);
        }
    
        // Update the lesson availability locally
        if (lesson.available > 0) {
          lesson.available --;
        }
    
        console.log(this.carts);
      }
    },
    
  

    updateLessonAvailability: function (lessonId, available) {
      const updateData = {
        available: available,
      };
    
      fetch(`https://cartsystem-env.eba-pybmsf3v.eu-north-1.elasticbeanstalk.com/collections/Products/${lessonId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((updatedLesson) => {
          console.log('Lesson updated successfully on the server:', updatedLesson);
        })
        .catch((error) => {
          console.error('Error updating lesson availability:', error);
        });
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
            lesson_id: item._id,  
            addedToCart: item.AddedTOCart,
            removedfromcart: item.available,
          };
        });
      
                  
        // Update lesson availability on the server for each lesson in the cart
        cartItems.forEach((cartItem) => {
          this.updateLessonAvailability(cartItem.lesson_id, cartItem.removedfromcart);
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
      },
      deleteAllCaches() {
        caches.keys().then(function(names) {
         for (let name of names)
        caches.delete(name);
         });
         console.log("All Caches Deleted");
         },
         unregisterAllServiceWorkers() {
          navigator.serviceWorker.getRegistrations().then(function (registrations) {
           for (let registration of registrations) {
          registration.unregister()
           }
           });
           console.log("ServiceWorkers Unregistered");
           },
           reloadPage() {
            window.location.reload();
             },
      
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
      
      
      async searchLessons() {
        try {
          // Check if the search query is empty
          if (!this.searchQuery.trim()) {
            // If the search query is empty, reset the lessons to the original data
            this.fetchDataFromAPI();
            return;
          }
      
          // Construct the URL with the query parameter
          const url = `https://cartsystem-env.eba-pybmsf3v.eu-north-1.elasticbeanstalk.com/collections/Products/search?q=${this.searchQuery}`;
      
          // Make the fetch request
          const response = await fetch(url);
      
          // Check if the request was successful
          if (!response.ok) {
            throw new Error('Failed to fetch search results');
          }
      
          // Parse the JSON response
          const data = await response.json();
      
          // Update the lessons with the search results
          this.lessons = data;
      
          // Check if search returned no results
          if (this.lessons.length === 0) {
            console.log('No results found.');
            // You can provide a message to the user indicating no results were found
          }
        } catch (error) {
          console.error('Error during search:', error);
          // Handle errors as needed
        }
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
  created() {
      if ("serviceWorker" in navigator) {
          navigator.serviceWorker.register("service-worker.js");
      }
  },
  mounted() {
  // Fetch data when the component is mounted
  this.fetchDataFromAPI();
},
});
