<app>
    <div>
        <mjpegtag each={ feed in feeds } feed={ feed } />
    </div>
  
    <div>
        <mjpeg each={ feed in activeFeeds } feed={ feed } key="id" />
    </div>
  
    <script>
    this.activeFeeds = [];
    this.feeds = [
        { id: "1", name: "Anes Left", location: "192.168.1.201", height: "450", width: "800" },
        { id: "2", name: "Anes Foot", location: "192.168.1.202", height: "450", width: "800" },
        { id: "3", name: "Lap/Endo", location: "192.168.1.203", height: "450", width: "800" }
    ]

    changeView(feed) {
        if (this.activeFeeds.includes(feed)) {
            const index = this.activeFeeds.indexOf(feed);
            this.activeFeeds.splice(index, 1);
        } else {
            this.activeFeeds.push(feed);
        }
        this.update();
    }
    </script>
</app>