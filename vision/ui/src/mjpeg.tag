<mjpeg>
    <p>id: { opts.feed.id }, name: { opts.feed.name }, path: { this.path }</p>
    
    <img id={ opts.feed.id } src={ this.path }>

    <script>
        this.path = "http://" + opts.feed.location + "/mjpg/1/video.mjpg";
    </script>

    <style>
        :scope {
            display: block;
            float: left;
            margin: 10px;
        }

        img {
            height: 450px;
            width: 800px;
        }
    </style>
</mjpeg>