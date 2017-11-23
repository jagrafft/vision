package co.grafft.vision.master

import org.scalatest._

class MasterSpec extends FlatSpec with Matchers {
  "The Master Microservce" should "print version: 0.1.0-SNAPSHOT" in {
    Master.version shouldEqual "0.1.0-SNAPSHOT"
  }
}