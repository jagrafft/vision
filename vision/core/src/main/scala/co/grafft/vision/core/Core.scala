package co.grafft.vision.core

object Core extends Version with App {
  println(s"co.grafft.vision.core: $version")
}

trait Version {
  lazy val version: String = "0.1.0-SNAPSHOT"
}