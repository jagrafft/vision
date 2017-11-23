package co.grafft.vision.vision

object Vision extends Version with App {
  println(version)
}

trait Vision {
  lazy val version: String = "0.1.0-SNAPSHOT"
}