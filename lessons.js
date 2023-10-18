let courseStore = new Vue ({
    el: "#app",
    data: {
        sitename: "LessonStore",
        show: true,
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
                time: Date()
            },
            {
                id: 2,
                subject: "Javascript Tutorials",
                location: "London",
                image: "https://dotnet.microsoft.com/static/images/refresh/blazor-hero.png",
                price: "$" + 2000,
                available: 5,
                AddedTOCart: 0
            },
            {
                id: 3,
                subject: "C# Tutorials",
                location: "London",
                image: "https://dotnet.microsoft.com/static/images/refresh/blazor-hero.png",
                price: "$" + 2000,
                available: 5,
                AddedTOCart: 0
            },
            {
                id: 4,
                subject: "Blazor Tutorials",
                location: "London",
                image: "https://dotnet.microsoft.com/static/images/refresh/blazor-hero.png",
                price: "$" + 2000,
                available: 5,
                AddedTOCart: 0
            },
            {
                id: 5,
                subject: "NodeJs Tutorials",
                location: "London",
                image: "https://dotnet.microsoft.com/static/images/refresh/blazor-hero.png",
                price: "$" + 2000,
                available: 5,
                AddedTOCart: 0
            },
            {
                id: 6,
                subject: "Asp.netCore Tutorials",
                location: "London",
                image: "https://dotnet.microsoft.com/static/images/refresh/blazor-hero.png",
                price: "$" + 2000,
                available: 5,
                AddedTOCart: 0
            },
            {
                id: 7,
                subject: "Asp.net Mvc Tutorials",
                location: "London",
                image: "https://dotnet.microsoft.com/static/images/refresh/blazor-hero.png",
                price: "$" + 2000,
                available: 5,
                AddedTOCart: 0
            },
            {
                id: 8,
                subject: "Phython Tutorials",
                location: "London",
                image: "https://dotnet.microsoft.com/static/images/refresh/blazor-hero.png",
                price: "$" + 2000,
                available: 5,
                AddedTOCart: 0
            },
            {
                id: 9,
                subject: ".NET Tutorials",
                location: "London",
                image: "https://dotnet.microsoft.com/static/images/refresh/blazor-hero.png",
                price: "$" + 2000,
                available: 5,
                AddedTOCart: 0
            },
            {
                id: 10,
                subject: "PHP Tutorials",
                location: "London",
                image: "https://dotnet.microsoft.com/static/images/refresh/blazor-hero.png",
                price: "$" + 2000,
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
                if(lesson.id)
                this.carts.push(lesson);

                lesson.available--;
                lesson.AddedTOCart++;
                 console.log(this.carts);
              }
        },
        canAddToCart: function(lesson){
            return lesson.available > 0;
        },
        removeFromCart(lesson) {
            // Check if the lesson is in the cart and remove it
            const index = this.carts.findIndex(item => item.id === lesson.id);
            if (index > -1) {
              this.carts.splice(index, 1);
              lesson.available++;
              lesson.AddedTOCart--;
            }
          }
    },
    computed: {
        ItemsInCart: function () {
            return this.carts.length;
        },
       
    }

})