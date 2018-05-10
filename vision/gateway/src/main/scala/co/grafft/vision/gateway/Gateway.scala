package co.grafft.vision.gateway

object Gateway extends Version with App {
  println(s"co.grafft.vision.gateway: $version")
}

trait Version {
  lazy val version: String = "0.1.0-SNAPSHOT"
}