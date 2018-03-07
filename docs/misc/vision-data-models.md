# Data Models from Prototype *vision* Server

```scala
case class AVCmd(
    cmd: String,
    value: String
)

case class AVDataRequest(
    label: String,
    sources: Seq[String]
)

case class DataType(
    id: Int,
    T: String,
    label: String
)

case class Node(
    id: Int,
    label: String,
    location: Option[String],
    dataSource: Boolean,
    dataTypeId: Int,
    address: String,
    port: Int,
    protocol: String,
    username: Option[String],
    password: Option[String],
    accessString: Option[String],
    streamString: Option[String],
    streamProtocol: Option[String],
    lastUpdate: Option[java.sql.Timestamp]
)

case class Session(
    id: Int,
    label: String,
    tags: Option[String],
    dt: java.sql.Timestamp,
    lastUpdate: Option[java.sql.Timestamp]
)

case class SessionData(
    id: Int,
    sessionId: Int,
    dataTypeId: Int,
    path: String,
    lastUpdate: Option[java.sql.Timestamp]
)
```