let courseStore = new Vue ({
    el: "#app",
    data: {
        sitename: "LessonStore",
        show: true,
        defaultSort: "subject",
        sortDirection: "asc", 
        searchQuery: "",
        //lesson array with list of lessons 
        lessons: [
            {
                id: 1,
                subject: "VueJs Tutorials",
                location: "London",
                image: "https://dotnet.microsoft.com/static/images/refresh/blazor-hero.png",
                price: "$" + 2000,
                available: 5,
                AddedTOCart: 0,
            },
            {
                id: 2,
                subject: "Javascript Tutorials",
                location: "Manchester",
                image: "https://dotnet.microsoft.com/static/images/refresh/blazor-hero.png",
                price: "$" + 1500,
                available: 5,
                AddedTOCart: 0
            },
            {
                id: 3,
                subject: "C# Tutorials",
                location: "Munbai",
                image: "https://dotnet.microsoft.com/static/images/refresh/blazor-hero.png",
                price: "$" + 3000,
                available: 5,
                AddedTOCart: 0
            },
            {
                id: 4,
                subject: "Blazor Tutorials",
                location: "Paris",
                image: "https://dotnet.microsoft.com/static/images/refresh/blazor-hero.png",
                price: "$" + 6000,
                available: 5,
                AddedTOCart: 0
            },
            {
                id: 5,
                subject: "NodeJs Tutorials",
                location: "Ohio",
                image: "https://dotnet.microsoft.com/static/images/refresh/blazor-hero.png",
                price: "$" + 3200,
                available: 5,
                AddedTOCart: 0
            },
            {
                id: 6,
                subject: "Asp.net Core Tutorials",
                location: "America",
                image: "https://dotnet.microsoft.com/static/images/refresh/blazor-hero.png",
                price: "$" + 7000,
                available: 5,
                AddedTOCart: 0
            },
            {
                id: 7,
                subject: "Asp.net Mvc Tutorials",
                location: "Barcelona",
                image: "https://dotnet.microsoft.com/static/images/refresh/blazor-hero.png",
                price: "$" + 8100,
                available: 5,
                AddedTOCart: 0
            },
            {
                id: 8,
                subject: "Phython Tutorials",
                location: "Zambia",
                image: "https://dotnet.microsoft.com/static/images/refresh/blazor-hero.png",
                price: "$" + 1000,
                available: 5,
                AddedTOCart: 0
            },
            {
                id: 9,
                subject: ".NET Tutorials",
                location: "Colindale",
                image: "https://dotnet.microsoft.com/static/images/refresh/blazor-hero.png",
                price: "$" + 10000,
                available: 5,
                AddedTOCart: 0
            },
            {
                id: 10,
                subject: "PHP Tutorials",
                location: "Nigeria",
                image: "https://dotnet.microsoft.com/static/images/refresh/blazor-hero.png",
                price: "$" + 500,
                available: 5,
                AddedTOCart: 0
            }
        ],
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
        performSearch() {
          this.lessons = this.lessons.filter((lesson) => {
            const query = this.searchQuery.toLowerCase();
            return (
              lesson.subject.toLowerCase().includes(query) ||
              lesson.location.toLowerCase().includes(query) ||
              lesson.price.toLowerCase().includes(query)
            );
          });
        },
    },
    computed: {
        ItemsInCart: function () {
            return this.carts.length;
        },
        sortedLessons() {
            return this.lessons.slice().sort((a, b) => {
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
    }

})