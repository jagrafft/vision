<mjpeg>
    <p>
        <img id={ opts.feed.id } src={ this.path } height={ opts.feed.height + "px" } width={ opts.feed.width + "px" }>
        <br>
        id: { opts.feed.id }, name: { opts.feed.name }, path: { this.path }
    </p>

    <script>
        this.path = "http://" + opts.feed.location + "/mjpg/1/video.mjpg";
    </script>

    <style>
        :scope {
            display: block;
            float: left;
        }
    </style>
</mjpeg>