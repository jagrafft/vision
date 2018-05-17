package co.grafft.vision.retina

object Retina extends Version with App {
  println(s"co.grafft.vision.retina: $version")
}

trait Version {
  lazy val version: String = "0.0.1-SNAPSHOT"
}