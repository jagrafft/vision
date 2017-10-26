package co.grafft.visionav.vision

object Vision extends Version with App {
  println(version)
}

trait Version {
  lazy val version: String = "0.1.0-SNAPSHOT"
}