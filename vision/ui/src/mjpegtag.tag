<mjpegtag>
    <span class="{ active: active }" onclick={ toggle }>{ opts.feed.name }</span>
    
    <script>
        this.active = false;

        toggle() {
            this.active = !this.active;
            this.parent.changeView(opts.feed);
        }
    </script>

    <style>
        .active {
            background-color: green;
            color: white;
        }

        span {
            font-weight: bolder;
            padding: 0px 10px 0px 10px;
        }
    </style>
</mjpegtag>