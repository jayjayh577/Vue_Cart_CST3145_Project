import lessons from './data//lessonArray.js';
  let courseStore = new Vue ({
    el: "#app",
    data: {
        sitename: "LessonStore",
        checkoutinfo: "Check Out Info",
        show: true,
        defaultSort: "null",
        sortDirection: "asc", 
        searchQuery:"", 
        lessons: lessons,
        checkoutInfo: {
          Name: "",
          Number: "",
        },
        NameValid: "",
        NumberValid: "",
        carts: [],
    },
    methods: {
        addToCart: function(lesson){
            if (this.canAddToCart(lesson)) {
                //check the list in the cart. If the lesson id already exists in the list of carts then just increase the number of classes available.
                // That means you need an extra property 
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
          alert(`Congratulations ${this.NameValid} You will be called on ${this.NumberValid} When our items are available`);
        },
    },
    computed: {
        ItemsInCart: function () {
            return this.carts.length;
        },
        searchLessons() {
          const query = this.searchQuery.toLowerCase();
            
          // Filter the lessons based on the search query
          const filteredLessons = this.lessons.filter((lesson) => {
            return (
              lesson.subject.toLowerCase().includes(query) ||
              lesson.location.toLowerCase().includes(query) ||
              lesson.price.toString().toLowerCase().includes(query)  // Convert to string before using toLowerCase
            );
          });

          // Sort the filtered lessons
          const sortOrder = this.sortDirection === "asc" ? 1 : -1;
          return filteredLessons.slice().sort((a, b) => {
            if (this.defaultSort === "subject") {
              return sortOrder * a.subject.localeCompare(b.subject);
            } else if (this.defaultSort === "location") {
              return sortOrder * a.location.localeCompare(b.location);
            }else if (this.defaultSort === "price") {
              const priceA = parseFloat(a.price);
              const priceB = parseFloat(b.price);
              return sortOrder * (priceA - priceB);

            } else if (this.defaultSort === "available") {
              return sortOrder * (a.available - b.available);
            }
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
})